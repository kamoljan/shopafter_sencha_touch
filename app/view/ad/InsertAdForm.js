Ext.define('ShopAfter.view.ad.InsertAdForm', {
    extend: 'Ext.form.Panel',
    xtype: 'insertadform',
    id: 'insertadform',
    requires: [
        'Ext.Toolbar',
        'Ext.field.Text',
        'Ext.field.Search',
        'Ext.dataview.List',
        'Ext.form.Panel',
        'Ext.plugin.ListPaging',
        // Insert Ad
        'Ext.MessageBox',
        'Ext.data.Errors',
        'ShopAfter.proxy.Ads',
        'ShopAfter.model.Ad'
    ],
    config: {
        layout: "vbox",
        title: 'Sell it now!',
        cls: "insertadform",
        header: [
            {
                iconCls: "list",
                ui: "plain",
                docked: "top",
                align: 'left'
            },
            {
                xtype: "formpanel",
                scrollable: null,
                cls: 'fieldset1',
                items: [
                    {
                        xtype: 'fieldset',
                        id: 'fieldset1',
                        //title: 'Sell it now!',
                        //instructions: 'Please enter the information above.',
                        defaults: {
                            labelWidth: '25%'
                        },
                        items: [
                            {
                                xtype: 'image',
                                id: 'adphoto',
                                name: 'adphoto',
                                cls: 'picture-capture',

                              //  width: 85,
                                height: 93,
                                html: [
                                    '<div class="icon"></div>',
                                    '<div class="image-tns"></div>',

                                ].join('')
                            },
                            {
                                xtype: 'selectfield',
                                cls: 'select-cat',
                                id: 'category',
                                name: 'category',
                                required: true,
                                placeHolder: 'Category',
                                autoSelect: false,
                                options: [
                                    {text: 'Clothes', value: 1},
                                    {text: 'Accessories', value: 2},
                                    {text: 'Shoes & Bags', value: 3},
                                    {text: 'Mobile Phones', value: 4},
                                    {text: 'Children Items', value: 5},
                                    {text: 'Tech Gadgets', value: 6},
                                    {text: 'Household Items', value: 7},
                                    {text: 'Hobbies & Collectibles', value: 8},
                                    {text: 'Pets', value: 9},
                                    {text: 'Cars', value: 10},
                                    {text: 'Houses', value: 11},
                                    {text: 'Sports', value: 12}
                                ]
                            },
                            {
                                xtype: 'textareafield',
                                id: 'description',
                                name: 'description',
                                placeHolder: 'Item descriptions (140)',
                                required: true,
                                clearIcon: true
                            },
                            {
                                xtype: 'numberfield',
                                id: 'price',
                                name: 'price',
                                placeHolder: 'Price',
                                required: true,
                                clearIcon: true
                            },
                            {
                                xtype: 'numberfield',
                                id: 'phone',
                                name: 'phone',
                                placeHolder: 'Phone number',
                                required: true,
                                clearIcon: true
                            },
                            {
                                xtype: 'container',
                                cls: 'buttons-adIn',
                                defaults: {
                                    xtype: 'button',
                                    style: 'margin: 10px 0px 25px',
                                    flex: 1
                                },
                                
                                items: [
                                    {
                                        text: 'Reset',
                                        cls: 'reset',
                                        handler: function () {
                                            Ext.getCmp('insertadform').reset();
                                        }
                                    },
                                    {
                                        text: 'Sell',
                                        id: 'saveAdForm',
                                        cls: 'saveAdForm'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
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
    }
});
