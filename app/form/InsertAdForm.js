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
                cls: 'adFormFormPanel',
                items: [
                    {
                        xtype: 'fieldset',
                        id: 'adFormFieldSet',
                        defaults: {
                            labelWidth: '25%'
                        },
                        items: [
                            {
                                xtype: 'image',
                                id: 'adphoto',
                                name: 'adphoto',
                                cls: 'adFormAdPhoto',
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
                                xtype: 'textfield',
                                id: 'title',
                                name: 'title',
                                placeHolder: 'What are you selling?',
                                required: true,
                                clearIcon: true
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
                                cls: 'adFormContainer',
                                defaults: {
                                    style: 'margin: 0px',
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        cls: 'adFormCurrency',
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
                                        cls: 'adFomrPrice',
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
                                value: 65,
                                placeHolder: 'Phone number',
                                required: true,
                                clearIcon: true
                            },
                            {
                                xtype: 'container',
                                cls: 'adFormContainer',
                                defaults: {
                                    xtype: 'button',
                                    style: 'margin: 10px 0px 25px',
                                    flex: 1
                                },
                                items: [
                                    {
                                        text: 'Reset',
                                        cls: 'adFormBtnReset',
                                        handler: function () {
                                            Ext.getCmp('insertadform').reset();
                                        }
                                    },
                                    {
                                        text: 'Sell',
                                        id: 'saveAdForm',
                                        cls: 'adFromBtnSave'
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
                        this._termspanel.setTermsVisible(true);  // Handling Android backbutton
                        this._termspanel.show();
                    }
                },
                element: 'element'
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
