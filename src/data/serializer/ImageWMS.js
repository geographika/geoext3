/* Copyright (c) 2015 The Open Source Geospatial Foundation
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
 * A serializer for layer that hava a `ol.source.ImageWMS` source.
 */
Ext.define('GeoExt.data.serializer.ImageWMS', {
    extend: 'GeoExt.data.serializer.Base',

    requires: [
        'GeoExt.util.Symbol'
    ],

    // <debug>
    symbols: [
        'ol.layer.Layer#getOpacity',
        'ol.source.ImageWMS',
        'ol.source.ImageWMS#getUrl',
        'ol.source.ImageWMS#getParams'
    ],
    // </debug>

    inheritableStatics: {
        /**
         * @inheritdoc
         */
        sourceCls: ol.source.ImageWMS,

        /**
         * @inheritdoc
         */
        serialize: function(layer, source) {
            this.validateSource(source);
            var serialized = {
                "baseURL": source.getUrl(),
                "customParams": source.getParams(),
                "layers": [
                    source.getParams().LAYERS
                ],
                "opacity": layer.getOpacity(),
                "styles": [ "" ],
                "type": "WMS"
            };
            return serialized;
        }
    }
}, function(cls) {
    // Register this serializer via the inherited method `register`.
    cls.register(cls);
    // <debug>
    GeoExt.util.Symbol.check(cls);
    // </debug>
});