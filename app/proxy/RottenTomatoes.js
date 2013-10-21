Ext.define('ShopAfter.proxy.RottenTomatoes', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.rottentomatoes',

    config: {
        type: 'ajax',
        url: "http://shopafter.com:9999/",
        reader: {
            type: "json",
            rootProperty: "ads"
        },
        service: "ads.json"  //FIXME: remove it
    },
    getUrl: function() {
        return this._url + this.getService();
    },
    encodeFilters: function(filters) {
        if (Ext.isArray(filters) && filters.length > 0) return filters[0].getValue();
        return "";
    }
});