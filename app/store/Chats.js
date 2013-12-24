Ext.define('ShopAfter.store.Chats', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['user', 'message'],
        id: 'Chats'
    }
});