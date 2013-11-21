Ext.define('ShopAfter.view.AdInsert', {
    extend: 'ShopAfter.view.AdsListView',
    xtype: 'adinsert',
    requires: [
        'ShopAfter.form.InsertAdForm',
        'ShopAfter.view.LoggedOut'
    ],
    config: {
        layout: 'vbox',
        header: {
            iconCls: 'list',
            ui: 'plain',
            left: 0
        }
    },
    _headerBar: null,
    _list: null,

    initialize: function () {
        this.create();
    },

    create: function () {
        this.removeAll(false);
        this.add(this.getHeaderBar());
        this.add(this.getList());
    },

    getHeaderBar: function () {
        if (!this._headerBar) {
            this._headerBar = Ext.create('Ext.Toolbar', {
                xtype: 'toolbar',
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
            this._list = Ext.widget('insertadform');
        }
        return this._list;
    }

});
