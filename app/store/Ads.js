Ext.define('ShopAfter.store.Ads', {
    extend: 'Ext.data.Store',
    requires: [
        'ShopAfter.model.Ad'
    ],
    config: {
        model: 'ShopAfter.model.Ad',
        storeId: 'Ads',
        proxy: {
            type: 'ajax',
            url: 'ad'
        }
    }
});