Ext.define('ShopAfter.proxy.Ads', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.ads',
    config: {
        type: 'ajax',
        url: "http://shopafter.com:3000/",
        /**
         * Set useDefaultXhrHeader to false to not send the default Xhr header (X-Requested-With) with every request.
         * This should be set to false when making CORS (cross-domain) requests.
         * Defaults to: true
         */
        useDefaultXhrHeader: false,
        reader: {
            type: "json",
            rootProperty: "ads"
        },
        service: "search"
    },
    getUrl: function () {
        return this._url + this.getService();
    },
    encodeFilters: function (filters) {
        if (Ext.isArray(filters) && filters.length > 0) return filters[0].getValue();
        return "";
    }
});