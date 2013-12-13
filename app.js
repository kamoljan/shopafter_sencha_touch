var pubnub = PUBNUB({
    publish_key : 'pub-c-9935d7db-1e0f-4d08-be4a-4bf95690cce1',
    subscribe_key : 'sub-c-df2e4f1a-2cb8-11e3-849c-02ee2ddab7fe',
    ssl : false,
    origin : 'pubsub.pubnub.com'
});


Ext.application({
    name: 'ShopAfter',
    requires: [
        'Ext.MessageBox',
        'Ext.device.Storage',
        'Ext.Menu',
        'ShopAfter.components.MenuButton',
        'Ext.form.FieldSet',
        'Ext.plugin.PullRefresh'
    ],
    controllers: [
        'ShopAfter.controller.Facebook',
        'ShopAfter.controller.Main',
        'ShopAfter.controller.AdInsert',
        'ShopAfter.controller.AdDetails'
    ],
    views: [
        'ShopAfter.view.Main',
        'ShopAfter.view.WelcomeOverlay'
    ],
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },
    isIconPrecomposed: true,
    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch1: function () {
        var myStore = Ext.create('Ext.data.Store', {
            storeId: 'list',
            fields: ['txt']
        }); // create()

        Ext.create('Ext.List', {
            fullscreen: true,
            store: 'list',
            itemTpl: '{txt}',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Channel',
                            name: 'channel',
                            id: 'channel',
                            align: 'left',
                        },
                        {
                            text: 'Subscribe',
                            align: 'left',
                            handler: function () {
                                var channel = Ext.getCmp('channel').getValue() || 'sencha-demo-channel';
                                //myStore.removeAll();
                                pubnub.subscribe({
                                    channel: channel,
                                    callback: function (message) {
                                        myStore.insert(0, {txt: JSON.stringify(message)});
                                    }
                                });
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: 'Message',
                            name: 'message',
                            id: 'message',
                            align: 'right'
                        },
                        {
                            text: 'Publish',
                            align: 'right',
                            handler: function () {
                                var channel = Ext.getCmp('channel').getValue() || 'sencha-demo-channel';
                                var message = Ext.getCmp('message').getValue() || 'default-dummy-message';
                                pubnub.publish({
                                    channel: channel,
                                    message: message
                                });
                            }
                        }
                    ]
                }
            ]
        });
    },

    launch: function () {
        Ext.getBody().removeCls('loading');
        Ext.create('ShopAfter.view.Main');
        if (Ext.device.Storage.getItem('isFirstTime') !== "false") {
            Ext.device.Storage.setItem('isFirstTime', false);
            var overlay = Ext.create('ShopAfter.view.WelcomeOverlay');
            Ext.Viewport.add(overlay);
            overlay.show();
        }
        var menu = Ext.create("Ext.Menu", {
            defaults: {
                xtype: "menubutton"
            },
            width: '80%',
            scrollable: 'vertical',
            items: [
                {
                    text: 'Latest',
                    iconCls: 'time',
                    menu: "opening"
                },
                {
                    text: 'Search',
                    iconCls: 'search',
                    menu: "search"
                },
                {
                    text: 'Post Ad',
                    iconCls: 'add',
                    menu: "insert"
                },
                {
                    text: 'Feedback',
                    iconCls: 'team',
                    handler: function () {
                        window.location = 'mailto:kamoljan@gmail.com';
                    }
                }
            ]
        });

        Ext.Viewport.setMenu(menu, {
            side: 'left',
            reveal: true
        });

        // Handling Android Backbutton
        if (Ext.os.is('Android')) {
            document.addEventListener("backbutton", Ext.bind(onBackKeyDown, this), false);
            function onBackKeyDown(e) {
                e.preventDefault();
                var terms = Ext.getCmp('termspanel');
                if (ShopAfter.app.getController('ShopAfter.controller.AdDetails').getAdDetailsVisible()) {
                    ShopAfter.app.getController('ShopAfter.controller.AdDetails')._adDetails.hide();
                    ShopAfter.app.getController('ShopAfter.controller.AdDetails').setAdDetailsVisible(false);
                } else if (terms && terms.getTermsVisible()) {
                    terms.hide();
                    terms.setTermsVisible(false);
                } else if (!menu.isHidden()) {
                    Ext.Viewport.toggleMenu("left");
                } else {
                    Ext.Msg.confirm(
                        "Exit",
                        "Do you want to exit the app?",
                        function (answer) {
                            if (answer === 'yes') {
                                navigator.app.exitApp();
                            }
                        }
                    );
                }
            }
        }
    },

    onUpdated: function () {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function (buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
