Ext.define('ShopAfter.store.Chats', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['user', 'message'],
//        fields: ['txt'],
//        fields: [
//            { name: 'user', type: 'string' },
//            { name: 'message', type: 'string' }
//        ],
        id: 'Chats'
    }
});