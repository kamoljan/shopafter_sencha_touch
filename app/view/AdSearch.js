Ext.define('ShopAfter.view.AdSearch', {
    extend: 'ShopAfter.view.AdsListView',
    xtype: 'adsearch',
    requires: [
        'Ext.Toolbar', 'Ext.field.Text', 'Ext.field.Search', 'Ext.dataview.List',
        'Ext.form.Panel', 'Ext.plugin.ListPaging',
        'ShopAfter.proxy.RottenTomatoes', 'ShopAfter.model.Ad'],
    config: {
        enablePaging: true,
        autoLoad: false,
        cls: "adsearch",
        header: [
            {
                iconCls: "list",
                ui: "plain",
                docked: "left"
            },
            {
                xtype: "formpanel",
                scrollable: null,
                items: [
                    {
                        xtype: 'searchfield',
                        placeHolder: 'Ad Search..'
                    }
                ]
            }
        ]
    },
    getStore: function () {
        if (!this._store) {
            this.callParent();
            this._store.setRemoteFilter(true);

            //Intercept the load function and short circuit it when there is no query
            this._store.load = Ext.Function.createInterceptor(this._store.load, function () {
                var filters = this.getFilters(),
                    len = filters.length,
                    filter;
                for (var i = 0; i < len; i++) {
                    filter = filters[i];
                    if (filter.getId() === "query" && filter.getValue().length > 0) return true;
                }
                return false;
            }, this._store)
        }
        return this._store;
    }
});
