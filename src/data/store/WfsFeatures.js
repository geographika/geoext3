/* Copyright (c) 2015-present The Open Source Geospatial Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * A data store loading features from an OGC WFS.
 *
 * @class GeoExt.data.store.WfsFeatures
 */
Ext.define('GeoExt.data.store.WfsFeatures', {
  extend: 'GeoExt.data.store.Features',
  mixins: ['GeoExt.mixin.SymbolCheck', 'GeoExt.util.OGCFilter'],

  /**
   * If autoLoad is true, this store's loadWfs method is automatically called
   * after creation.
   * @cfg {boolean}
   */
  autoLoad: true,

  /**
   * Default to using server side sorting
   * @cfg {boolean}
   */
  remoteSort: true,

  /**
   * Default to using server side filtering
   * @cfg {boolean}
   */
  remoteFilter: true,

  /**
   * Default logical comperator to combine filters sent to WFS
   * @cfg {string}
   */
  logicalFilterCombinator: 'And',

  /**
   * Default request method to use in AJAX requests
   * @cfg {string}
   */
  requestMethod: 'GET',

  /**
   * The 'service' param value used in the WFS request.
   * @cfg {string}
   */
  service: 'WFS',

  /**
   * The 'version' param value used in the WFS request.
   * This should be '2.0.0' or higher at least if the paging mechanism
   * should be used.
   * @cfg {string}
   */
  version: '2.0.0',

  /**
   * The 'request' param value used in the WFS request.
   * @cfg {string}
   */
  request: 'GetFeature',

  /**
   * The 'typeName' param value used in the WFS request.
   * @cfg {string}
   */
  typeName: null,

  /**
   * The 'srsName' param value used in the WFS request. If not set
   * it is automatically set to the map projection when available.
   * @cfg {string}
   */
  srsName: null,
  /**
   * The 'outputFormat' param value used in the WFS request.
   * @cfg {string}
   */
  outputFormat: 'application/json',

  /**
   * The 'startIndex' param value used in the WFS request.
   * @cfg {string}
   */
  startIndex: 0,

  /**
   * The 'count' param value used in the WFS request.
   * @cfg {string}
   */
  count: null,

  /**
   * A comma-separated list of property names to retrieve
   * from the server. If left as null all properties are returned.
   * @cfg {string}
   */
  propertyName: null,

  /**
   * Offset to add to the #startIndex in the WFS request.
   * @cfg {number}
   */
  startIndexOffset: 0,

  /**
   * The OL format used to parse the WFS GetFeature response.
   * @cfg {ol.format.Feature}
   */
  format: null,

  /**
   * The attribution added to the created vector layer source. Only has an
   * effect if #createLayer is set to `true`
   * @cfg {string}
   */
  layerAttribution: null,

  /**
   * Additional OpenLayers properties to apply to the created vector layer.
   * Only has an effect if #createLayer is set to `true`
   * @cfg {string}
   */
  layerOptions: null,

  /**
   * Cache the total number of features be queried from when the store is
   * first loaded to use for the remaining life of the store.
   * This uses resultType=hits to get the number of features and can improve
   * performance rather than calculating on each request. It should be used
   * for read-only layers, or when the server does not return the
   * feature count on each request.
   * @cfg {boolean}
   */
  cacheFeatureCount: false,

  /**
   * The outputFormat sent with the resultType=hits request.
   * Defaults to GML3 as some WFS servers do not support this
   * request type when using application/json.
   * Only has an effect if #cacheFeatureCount is set to `true`
   * @cfg {boolean}
   */
  featureCountOutputFormat: 'gml3',

  /**
   * Time any request will be debounced. This will prevent too
   * many successive request.
   * @cfg {number}
   */
  debounce: 300,

  /**
   * Constructs the WFS feature store.
   *
   * @param {Object} config The configuration object.
   * @private
   */
  constructor: function (config) {
    const me = this;

    config = config || {};

    // apply count as store's pageSize
    config.pageSize = config.count || me.count;

    if (config.pageSize > 0) {
      // calculate initial page
      const startIndex = config.startIndex || me.startIndex;
      config.currentPage = Math.floor(startIndex / config.pageSize) + 1;
    }

    // avoid creation of vector layer by parent class (raises error when
    // applying WFS data) so we can create the WFS vector layer on our own
    // (if needed)
    const createLayer = config.createLayer;
    config.createLayer = false;
    config.passThroughFilter = false; // only has effect for layers

    me.callParent([config]);

    me.loadWfsTask_ = new Ext.util.DelayedTask();

    if (!me.url) {
      Ext.raise('No URL given to WfsFeaturesStore');
    }

    if (createLayer) {
      // the WFS vector layer showing the WFS features on the map
      me.source = new ol.source.Vector({
        features: new ol.Collection(),
        attributions: me.layerAttribution,
      });

      const layerOptions = {
        source: me.source,
        style: me.style,
      };

      if (me.layerOptions) {
        Ext.applyIf(layerOptions, me.layerOptions);
      }

      me.layer = new ol.layer.Vector(layerOptions);

      me.layerCreated = true;
    }

    if (me.cacheFeatureCount === true) {
      me.cacheTotalFeatureCount(!me.autoLoad);
    } else {
      if (me.autoLoad) {
        // initial load of the WFS data
        me.loadWfs();
      }
    }

    // before the store gets re-loaded (e.g. by a paging toolbar) we trigger
    // the re-loading of the WFS, so the data keeps in sync
    me.on('beforeload', me.loadWfs, me);

    // add layer to connected map, if available
    if (me.map && me.layer) {
      me.map.addLayer(me.layer);
    }
  },

  /**
   * Detects the total amount of features (without paging) of the given
   * WFS response. The detection is based on the response format (currently
   * GeoJSON and GML >=v3 are supported).
   *
   * @private
   * @param  {Object} wfsResponse The XMLHttpRequest object
   * @return {number}            Total amount of features
   */
  getTotalFeatureCount: function (wfsResponse) {
    let totalCount = -1;
    // get the response type from the header
    const contentType = wfsResponse.getResponseHeader('Content-Type');

    try {
      if (contentType.indexOf('application/json') !== -1) {
        const respJson = Ext.decode(wfsResponse.responseText);
        totalCount = respJson.numberMatched;
      } else {
        // assume GML
        const xml = wfsResponse.responseXML;
        if (xml && xml.firstChild) {
          const total = xml.firstChild.getAttribute('numberMatched');
          totalCount = parseInt(total, 10);
        }
      }
    } catch (e) {
      Ext.Logger.warn(
        'Error while detecting total feature count from ' + 'WFS response',
      );
    }

    return totalCount;
  },

  /**
   * Sends the sortBy parameter to the WFS Server
   * If multiple sorters are specified then multiple fields are
   * sent to the server.
   * Ascending sorts will append ASC and descending sorts DESC
   * E.g. sortBy=attribute1 DESC,attribute2 ASC
   * @private
   * @return {string} The sortBy string
   */
  createSortByParameter: function () {
    const me = this;
    const sortStrings = [];
    let direction;
    let property;

    me.getSorters().each(function (sorter) {
      // direction will be ASC or DESC
      direction = sorter.getDirection();
      property = sorter.getProperty();
      sortStrings.push(Ext.String.format('{0} {1}', property, direction));
    });

    return sortStrings.join(',');
  },

  /**
   * Create filter parameter string (according to Filter Encoding standard)
   * based on the given instances in filters ({Ext.util.FilterCollection}) of
   * the store.
   *
   * @private
   * @return {string} The filter XML encoded as string
   */
  createOgcFilter: function () {
    const me = this;
    const filters = [];
    me.getFilters().each(function (item) {
      filters.push(item);
    });
    if (filters.length === 0) {
      return null;
    }
    return GeoExt.util.OGCFilter.getOgcWfsFilterFromExtJsFilter(
      filters,
      me.logicalFilterCombinator,
      me.version,
    );
  },

  /**
   * Gets the number of features for the WFS typeName
   * using resultType=hits and caches it so it only needs to be calculated
   * the first time the store is used.
   *
   * @param  {boolean} skipLoad Avoids loading the store if set to `true`
   * @private
   */
  cacheTotalFeatureCount: function (skipLoad) {
    const me = this;
    const url = me.url;
    me.cachedTotalCount = 0;

    const params = {
      service: me.service,
      version: me.version,
      request: me.request,
      typeName: me.typeName,
      outputFormat: me.featureCountOutputFormat,
      resultType: 'hits',
    };

    Ext.Ajax.request({
      url: url,
      method: me.requestMethod,
      params: params,
      success: function (resp) {
        // set number of total features (needed for paging)
        me.cachedTotalCount = me.getTotalFeatureCount(resp);
        if (!skipLoad) {
          me.loadWfs();
        }
      },
      failure: function (resp) {
        Ext.Logger.warn(
          'Error while requesting features from WFS: ' +
            resp.responseText +
            ' Status: ' +
            resp.status,
        );
      },
    });
  },

  /**
   * Handles the 'filterchange'-event.
   * Reload data using updated filter config.
   * @private
   */
  onFilterChange: function () {
    const me = this;
    if (me.getFilters() && me.getFilters().length > 0) {
      me.loadWfs();
    }
  },

  /**
   * Create a parameters object used to make a WFS feature request
   * @return {Object} A object of WFS parameter keys and values
   */
  createParameters: function () {
    const me = this;

    const params = {
      service: me.service,
      version: me.version,
      request: me.request,
      typeName: me.typeName,
      outputFormat: me.outputFormat,
    };

    // add a propertyName parameter if set
    if (me.propertyName !== null) {
      params.propertyName = me.propertyName;
    }

    // add a srsName parameter
    if (me.srsName) {
      params.srsName = me.srsName;
    } else {
      // if it has not been set manually retrieve from the map
      if (me.map) {
        params.srsName = me.map.getView().getProjection().getCode();
      }
    }

    // send the sortBy parameter only when remoteSort is true
    // as it is not supported by all WFS servers
    if (me.remoteSort === true) {
      const sortBy = me.createSortByParameter();
      if (sortBy) {
        params.sortBy = sortBy;
      }
    }

    // create filter string if remoteFilter is activated
    if (me.remoteFilter === true) {
      const filter = me.createOgcFilter();
      if (filter) {
        params.filter = filter;
      }
    }

    // apply paging parameters if necessary
    if (me.pageSize) {
      me.startIndex = (me.currentPage - 1) * me.pageSize + me.startIndexOffset;
      params.startIndex = me.startIndex;
      params.count = me.pageSize;
    }

    return params;
  },

  /**
   * Loads the data from the connected WFS.
   * @private
   */
  loadWfs: function () {
    const me = this;

    if (me.loadWfsTask_.id === null) {
      me.loadWfsTask_.delay(me.debounce, function () {});
      me.loadWfsInternal();
    } else {
      me.loadWfsTask_.delay(me.debounce, function () {
        me.loadWfsInternal();
      });
    }
  },

  loadWfsInternal: function () {
    const me = this;

    const url = me.url;
    const params = me.createParameters();

    // fire event 'gx-wfsstoreload-beforeload' and skip loading if listener
    // function returns false
    if (me.fireEvent('gx-wfsstoreload-beforeload', me, params) === false) {
      return;
    }

    // request features from WFS
    Ext.Ajax.request({
      url: url,
      method: me.requestMethod,
      params: params,
      success: function (resp) {
        if (!me.format) {
          Ext.Logger.warn(
            'No format given for WfsFeatureStore. ' +
              'Skip parsing feature data.',
          );
          return;
        }

        if (me.cacheFeatureCount === true) {
          // me.totalCount is reset to 0 on each load so reset it here
          me.totalCount = me.cachedTotalCount;
        } else {
          // set number of total features (needed for paging)
          me.totalCount = me.getTotalFeatureCount(resp);
        }

        // parse WFS response to OL features

        let wfsFeats = [];

        try {
          wfsFeats = me.format.readFeatures(resp.responseText);
        } catch (error) {
          Ext.Logger.warn(
            'Error parsing features into the ' +
              'OpenLayers format. Check the server response.',
          );
        }

        // set data for store
        me.setData(wfsFeats);

        if (me.layer) {
          // add features to WFS layer
          me.source.clear();
          me.source.addFeatures(wfsFeats);
        }

        me.fireEvent('gx-wfsstoreload', me, wfsFeats, true);
      },
      failure: function (resp) {
        if (resp.aborted !== true) {
          Ext.Logger.warn(
            'Error while requesting features from WFS: ' +
              resp.responseText +
              ' Status: ' +
              resp.status,
          );
        }
        me.fireEvent('gx-wfsstoreload', me, null, false);
      },
    });
  },

  doDestroy: function () {
    const me = this;

    if (me.loadWfsTask_.id !== null) {
      me.loadWfsTask_.cancel();
    }

    me.callParent(arguments);
  },
});
