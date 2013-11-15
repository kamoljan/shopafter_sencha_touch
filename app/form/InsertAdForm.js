Ext.define('ShopAfter.form.InsertAdForm', {
    extend: 'Ext.form.FormPanel',
    xtype: 'insertadform',
    id: 'insertadform',
    requires: [
        'Ext.field.Select',
        'Ext.field.Number',
        'Ext.data.Errors',
        'ShopAfter.proxy.Ads',
        'ShopAfter.model.InsertAd',
        'ShopAfter.view.Terms'
    ],
    config: {
        layout: "vbox",
        title: 'Sell it now!',
        cls: "insertadform",
        height: '100%',
        styleHtmlContent: true,
        header: [
            {
                xtype: "formpanel",
                scrollable: null,
                cls: 'fieldset1',
                items: [
                    {
                        xtype: 'fieldset',
                        id: 'fieldset1',
                        defaults: {
                            labelWidth: '25%'
                        },
                        items: [
                            {
                                xtype: 'image',
                                id: 'adphoto',
                                name: 'adphoto',
                                cls: 'picture-capture',
                                height: 93

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
                                xtype: 'container',
                                cls: 'buttons-adIn',
                                defaults: {
                                    style: 'margin: 0px',
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        cls: 'currencyAdFrom',
                                        id: 'currency',
                                        name: 'currency',
                                        required: true,
                                        autoSelect: true,
                                        value: 'SGD',
                                        options: [
                                            {text: 'IDR', value: 'IDR'},
                                            {text: 'MYR', value: 'MYR'},
                                            {text: 'PHP', value: 'PHP'},
                                            {text: 'SGD', value: 'SGD'},
                                            {text: 'VND', value: 'VND'}
                                        ]
                                    },
                                    {
                                        xtype: 'numberfield',
                                        cls: 'priceAdFrom',
                                        id: 'price',
                                        name: 'price',
                                        placeHolder: 'Price',
                                        required: true,
                                        clearIcon: true
                                    }
                                ]
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
                            },
                            {
                                html: [
                                    '<br />By posting this ad, I agree with ShopAfter <a class="link" style="position:relative;" href="#">Terms &amp; Conditions</a>'
                                ].join('')
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: {
            tap: {
                fn: function(e) {
                    if (e.getTarget('a.link')) {
                        if (!this._termspanel) {
                            this._termspanel = Ext.create('ShopAfter.view.Terms');
                        }
                        Ext.Viewport.add(this._termspanel);
                        this._termspanel.show();
                    }
                },
                element: 'element'
            },
            swipe: {
                fn: function() {},
                element: 'innerElement'
            }
        }
    },

    _headerBar: null,

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
