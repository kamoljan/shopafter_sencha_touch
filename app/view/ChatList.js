Ext.define('ShopAfter.view.ChatList', {
    extend: 'Ext.List',
    xtype: 'chatlist',
    requires: [
        'ShopAfter.store.Chats'
    ],
    config: {
        store: 'Chats',
        itemTpl: '<div class="adDetailFBPicture"><img src="https://graph.facebook.com/{user}/picture?type=square" /></div>{message}',
        flex: 1
    }
});