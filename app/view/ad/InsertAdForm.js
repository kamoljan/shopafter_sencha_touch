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
        'Ext.data.JsonP',
        'Ext.data.Errors',
        'Ext.device.Camera',
        'ShopAfter.proxy.RottenTomatoes',
        'ShopAfter.model.Ad',
        'ShopAfter.view.ad.CapturePicture'
    ],
    config: {
        layout: "vbox",
        title: null,
        menu: null,
        enablePaging: true,
        autoLoad: false,
        proxy: {},
        cls: "insertadform",
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
                        xtype: 'fieldset',
                        id: 'fieldset1',
                        title: 'Sell it now!',
                        //instructions: 'Please enter the information above.',
                        defaults: {
                            labelWidth: '25%'
                        },
                        items: [
                            {
                                xtype: 'image',
                                id: 'photo',
                                name: 'photo',
                                src: 'http://placehold.it/200x200',
                                width: 200,
                                height: 200,
                                listeners: {
                                    tap: function () {
                                        navigator.camera.getPicture(
                                            function (imageURI) {
                                                console.log(imageURI);
                                                uploadPhoto(imageURI);
                                            },
                                            function (message) {
                                                alert('Failed: ' + message);
                                            },
                                            {
                                                quality: 85,
                                                targetWidth: 200,
                                                targetHeight: 200,
                                                destinationType: Camera.DestinationType.FILE_URI,
                                                encodingType: Camera.EncodingType.JPEG,
                                                sourceType: Camera.PictureSourceType.CAMERA
                                            }
                                        )

                                        function uploadPhoto(imageURI) {
                                            var ft = new FileTransfer(),
                                                options = new FileUploadOptions();
                                            options.fileKey = 'file';
                                            options.httpMethod = 'PUT';
                                            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                                            alert("options.fileName = " + options.fileName);
                                            options.mimeType = "image/jpeg";
                                            //options.chunkedMode = false;

                                            var params = {};
                                            options.params = params;

                                            ft.upload(
                                                imageURI,
                                                encodeURI('http://shopafter.com:7777/upload'),
                                                win,
                                                fail,
                                                options);
                                            //var img = Ext.ComponentQuery.query('image')[0];
                                            //img.setSrc(image_uri);
                                        }

                                        function win(r) {
                                            console.log("Code = " + r.responseCode);
                                            console.log("Response = " + r.response);
                                            console.log("Sent = " + r.bytesSent);
                                        }

                                        function fail(error) {
                                            alert("An error has occurred: Code = " + error.code);
                                            alert("upload error source " + error.source);
                                            alert("upload error target " + error.target);
                                        }
                                    }
                                }
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
                                defaults: {
                                    xtype: 'button',
                                    style: 'margin: 10px 4.9% 25px',
                                    flex: 1
                                },
                                layout: {
                                    type: 'hbox'
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
