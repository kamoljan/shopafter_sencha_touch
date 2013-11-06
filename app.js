Ext.application({
    name: 'ShopAfter',
    requires: [
        'Ext.MessageBox',
        'Ext.device.Storage',
        'Ext.Menu',
        'ShopAfter.components.MenuButton',
        'Ext.form.FieldSet',
        'Ext.Img',
        'Ext.field.Select',
        'Ext.field.Number',
        'Ext.plugin.PullRefresh'
    ],
    controllers: [
        'ShopAfter.controller.Facebook',
        'ShopAfter.controller.Main',
        'ShopAfter.controller.AdInsert'
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
                        window.location = 'mailto:kamol701@gmail.com';
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
                if (ShopAfter.app.getController('ShopAfter.controller.Main').getAdDetailsVisible()) {
                    ShopAfter.app.getController('ShopAfter.controller.Main')._adDetails.hide();
                    ShopAfter.app.getController('ShopAfter.controller.Main').setAdDetailsVisible(false);
                } else if (!menu.isHidden()) {
                    Ext.Viewport.toggleMenu("left");
                } else {
                    Ext.Msg.confirm("Exit", "Do you want to exit the app?", function (answer) {
                        if (answer == 'yes') {
                            navigator.app.exitApp();
                        } else {
                            //do nothing
                        }
                    });
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
