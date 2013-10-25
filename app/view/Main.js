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
                autoLoad: false,
                enablePaging: true,
                proxy: {
                    service: 'search/',
                    params: {
                        sort: 'Date'
                    }

                }
            },
//            {
//                title: 'Nearest Ads',
//                menu: "theatres",
//                xtype: 'adslistview',
//                enablePaging: true,
//                proxy: {
//                    service: "ad/"
//                }
//            },
//            {
//                title: 'Latest Ads',
//                menu: "upcoming",
//                xtype: 'adslistview',
//                proxy: {
//                    service: "ad/"
//                }
//            },
            {
                menu: "search",
                xtype: 'adsearch'
            },
            {
                menu: "insert",
                xtype: 'insertadform'
            }
        ]
    }
});