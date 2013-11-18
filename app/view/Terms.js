Ext.define('ShopAfter.view.Terms', {
    extend: 'Ext.Panel',
    id: 'termspanel',
    config: {
        termsVisible: false,  // Handling Android backbutton
        scrollable: true,
        styleHtmlContent: true,
        items: [
            {
                title: 'Back',
                xtype: 'toolbar',
                name: 'backToolBar',
                docked: 'top',
                listeners: {
                    tap: {
                        fn: function (e) {
                            if (!this._termspanel) {
                                this._termspanel = Ext.getCmp('termspanel');
                            }
                            this._termspanel.hide();
                        },
                        element: 'element'
                    }
                }
            },
            {
                id: 'termstab',
                html: 'Loading top stories url...'
            }
        ],
        hidden: true,
        showAnimation: Ext.browser.is.ie || Ext.browser.is.AndroidStock ? null : {
            type: "fadeIn",
            duration: 250
        },
        hideAnimation: Ext.browser.is.ie || Ext.browser.is.AndroidStock ? null : {
            type: "fadeOut",
            duration: 250
        }
    },

    initialize: function () {
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/terms.html',
            method: 'GET',
            useDefaultXhrHeader: false,
            success: function (response, opts) {
                Ext.ComponentQuery.query('#termstab')[0].setHtml(response.responseText);
            }
        });
    }
});
