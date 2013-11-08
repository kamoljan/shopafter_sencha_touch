Ext.define('ShopAfter.view.AdsListView', {
    extend: 'Ext.Container',
    xtype: 'adslistview',
    requires: [
        'Ext.Img',
        'Ext.dataview.DataView',
        'Ext.dataview.List',
        'ShopAfter.proxy.Ads',
        'ShopAfter.model.Ad'
    ],
    config: {
        layout: "vbox",
        title: null,
        header: {
            iconCls: "list",
            ui: "plain",
            left: 0
        },
        menu: null,
        enablePaging: false,
        autoLoad: false,
        proxy: {}
    },
    _headerBar: null,
    _list: null,
    _store: null,
    _itemTemplate: null,

    initialize: function () {
        this.create();
    },

    create: function () {
        this.removeAll(false);
        this.add(this.getHeaderBar());
        this.add(this.getList());
        this.down("list").getStore().load();
    },

    getHeaderBar: function () {
        if (!this._headerBar) {
            this._headerBar = Ext.create("Ext.Toolbar", {
                xtype: "toolbar",
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                title: this.getTitle(),
                items: this.getHeader()
            });
        }
        return this._headerBar;
    },

    getList: function () {
        if (!this._list) {
            this._list = Ext.create("Ext.dataview.List", {
                flex: 1,
                emptyText: 'No ads found.',
                loadingText: "Loading Ads",
                cls: 'grid',
                plugins: this.getEnablePaging() ? [
                    {
                        xclass: 'Ext.plugin.PullRefresh',
                        pullText: 'Pull down for more new Ads!'
                    },
                    {
                        xclass: 'Ext.plugin.ListPaging',
                        autoPaging: true
                    }
                ] : null,
                mode: "simple",
                store: this.getStore(),
                itemTpl: this.getItemTemplate()
            });
        }
        return this._list;
    },

    getStore: function () {
        if (!this._store) {
            this._store = Ext.create("Ext.data.Store", {
                model: "ShopAfter.model.Ad",
                autoLoad: this.getAutoLoad() === true,
                remoteFilter: true,
                pageSize: 9,
                proxy: this.getProxy()
            });
        }
        return this._store;
    },

    getItemTemplate: function () {
        if (!this._itemTemplate) {
            this._itemTemplate = new Ext.XTemplate(
                '<div class="ad">',
                '<div class="img" style="background-image: url(\'{image}\')"></div>',
                '<div class="user"><span>{currency}</span> {price}</div>',
                '<div class="spacer"></div>',
                '</div>'
            )
        }
        return this._itemTemplate;
    },

    applyProxy: function (config) {
        if (Ext.isSimpleObject(config)) {
            return Ext.factory(config, 'ShopAfter.proxy.Ads')
        }
        return config;
    },

    updateProxy: function (value) {
        if (this._store) {
            this._store.setProxy(value);
            this._store.load();
        }
    },

    updateEnablePaging: function (currentValue, oldValue) {
        if (currentValue != oldValue && (currentValue != false && oldValue != undefined)) {
            this.create();
            this._store.load();
        }
        return currentValue;
    }
});
