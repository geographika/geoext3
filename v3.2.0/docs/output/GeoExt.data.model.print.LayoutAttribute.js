Ext.data.JsonP.GeoExt_data_model_print_LayoutAttribute({"tagname":"class","name":"GeoExt.data.model.print.LayoutAttribute","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"LayoutAttribute.js","href":"LayoutAttribute.html#GeoExt-data-model-print-LayoutAttribute"}],"aliases":{},"alternateClassNames":[],"extends":"GeoExt.data.model.Base","mixins":[],"requires":[],"uses":[],"members":[{"name":"identifier","tagname":"property","owner":"GeoExt.data.model.Base","id":"property-identifier","meta":{"private":true}},{"name":"schema","tagname":"property","owner":"GeoExt.data.model.Base","id":"property-schema","meta":{"private":true}},{"name":"getLayout","tagname":"method","owner":"GeoExt.data.model.print.LayoutAttribute","id":"method-getLayout","meta":{}},{"name":"loadRawData","tagname":"method","owner":"GeoExt.data.model.Base","id":"static-method-loadRawData","meta":{"static":true}}],"code_type":"ext_define","id":"class-GeoExt.data.model.print.LayoutAttribute","short_doc":"A Layout of a mapfish print service\nhas many layout attributes. ...","classIcon":"icon-class","superclasses":["Ext.data.Model","GeoExt.data.model.Base"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.data.Model<div class='subclass '><a href='#!/api/GeoExt.data.model.Base' rel='GeoExt.data.model.Base' class='docClass'>GeoExt.data.model.Base</a><div class='subclass '><strong>GeoExt.data.model.print.LayoutAttribute</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/LayoutAttribute.html#GeoExt-data-model-print-LayoutAttribute' target='_blank'>LayoutAttribute.js</a></div></pre><div class='doc-contents'><p>A <a href=\"#!/api/GeoExt.data.model.print.Layout\" rel=\"GeoExt.data.model.print.Layout\" class=\"docClass\">Layout</a> of a mapfish print service\nhas many layout attributes. You can create correct instances of this class\nby using the <a href=\"#!/api/GeoExt.data.MapfishPrintProvider\" rel=\"GeoExt.data.MapfishPrintProvider\" class=\"docClass\">GeoExt.data.MapfishPrintProvider</a>.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-identifier' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/GeoExt.data.model.Base' rel='GeoExt.data.model.Base' class='defined-in docClass'>GeoExt.data.model.Base</a><br/><a href='source/Base.html#GeoExt-data-model-Base-property-identifier' target='_blank' class='view-source'>view source</a></div><a href='#!/api/GeoExt.data.model.Base-property-identifier' class='name expandable'>identifier</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'uuid'</code></p></div></div></div><div id='property-schema' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/GeoExt.data.model.Base' rel='GeoExt.data.model.Base' class='defined-in docClass'>GeoExt.data.model.Base</a><br/><a href='source/Base.html#GeoExt-data-model-Base-property-schema' target='_blank' class='view-source'>view source</a></div><a href='#!/api/GeoExt.data.model.Base-property-schema' class='name expandable'>schema</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{id: 'geoext-schema', namespace: 'GeoExt.data.model'}</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-getLayout' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='GeoExt.data.model.print.LayoutAttribute'>GeoExt.data.model.print.LayoutAttribute</span><br/><a href='source/LayoutAttribute.html#GeoExt-data-model-print-LayoutAttribute-method-getLayout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/GeoExt.data.model.print.LayoutAttribute-method-getLayout' class='name expandable'>getLayout</a>( <span class='pre'></span> ) : <a href=\"#!/api/GeoExt.data.model.print.Layout\" rel=\"GeoExt.data.model.print.Layout\" class=\"docClass\">GeoExt.data.model.print.Layout</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the attribute parent layout model. ...</div><div class='long'><p>Returns the attribute parent layout model. May be null if\nLayoutAttribute is instantiated directly.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/GeoExt.data.model.print.Layout\" rel=\"GeoExt.data.model.print.Layout\" class=\"docClass\">GeoExt.data.model.print.Layout</a></span><div class='sub-desc'><p>The attributes layout</p>\n</div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-loadRawData' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/GeoExt.data.model.Base' rel='GeoExt.data.model.Base' class='defined-in docClass'>GeoExt.data.model.Base</a><br/><a href='source/Base.html#GeoExt-data-model-Base-static-method-loadRawData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/GeoExt.data.model.Base-static-method-loadRawData' class='name expandable'>loadRawData</a>( <span class='pre'>data</span> ) : <a href=\"#!/api/GeoExt.data.model.Base\" rel=\"GeoExt.data.model.Base\" class=\"docClass\">GeoExt.data.model.Base</a><span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Loads a record from a provided data structure initializing the models\nassociations. ...</div><div class='long'><p>Loads a record from a provided data structure initializing the models\nassociations. Simply calling Ext.create will not utilize the models\nconfigured reader and effectivly sidetrack associations configs.\nThis static helper method makes sure associations are initialized\nproperly and are available with the returned record.</p>\n\n<p>Be aware that the provided data may be modified by the models reader\ninitializing associations.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>The data the record will be created with.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/GeoExt.data.model.Base\" rel=\"GeoExt.data.model.Base\" class=\"docClass\">GeoExt.data.model.Base</a></span><div class='sub-desc'><p>The record.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});