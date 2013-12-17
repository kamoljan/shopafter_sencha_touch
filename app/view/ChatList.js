Ext.define('ShopAfter.view.ChatList', {
    extend: 'Ext.List',
    xtype: 'chatlist',
    requires: [
        'ShopAfter.store.Chats'
    ],
    config: {
        store: 'Chats',
        itemTpl: '{txt}',
        flex: 1
    }
});