Ext.define('ShopAfter.view.Main', {
    extend: 'Ext.Panel',
    xtype: "main",
    requires: [
        'ShopAfter.view.AdSearch',
        'ShopAfter.view.AdsListView',
        'ShopAfter.view.ad.InsertAdForm'
    ],
    config: {
        fullscreen: true,
        layout: 'card',
        ui: 'light',
        items: [
            {
                title: 'Latest Ads',
                menu: 'opening',
                xtype: 'adslistview',
                autoLoad: true,
                enablePaging: true,
                proxy: {
                    service: 'search/',
                    params: {
                        sort: 'Date'
                    }
                }
            },
            {
                menu: "search",
                xtype: 'adsearch'
            },
            {
                title: 'Sell it now!',
                menu: "insert",
                xtype: 'insertadform'
            }
        ]
    }
});