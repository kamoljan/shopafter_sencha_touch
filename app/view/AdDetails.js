Ext.define('ShopAfter.view.AdDetails', {
    extend: 'Ext.Container',
    requires: [
        'Ext.field.Text',
        'Ext.field.Search',
        'Ext.field.Select',
        'Ext.Button',
        'Ext.List',
        'Ext.Img',
        'ShopAfter.store.Chats',
        'ShopAfter.view.ChatList'
    ],
    xtype: 'addetails',
    id: 'addetails',
    config: {
        hidden: true,
        scrollable: true,
        fullscreen: true,
        cls: 'addetails',
        layout: 'vbox',
        showAnimation: {
            type: 'slideIn',
            direction: 'left',
            duration: 500
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'right',
            duration: 500
        },
        items: [
            {
                xtype: 'button',
                action: 'close',
                text: 'Back'
            },
            {
                itemId: 'adimage'
            },
            {
                cls: 'info',
                items: [
                    {
                        itemId: 'adfbpicture'
                    },
                    {
                        itemId: 'adname',
                        html: 'Loading...'
                    },
                    {
                        itemId: 'adtitle'
                    },
                    {
                        itemId: 'addate'
                    },
                    {
                        itemId: 'adprice'
                    },
                    {
                        itemId: 'addescription'
                    },
                    {
                        itemId: 'adphone'
                    },
                    {
                        itemId: 'adsms'
                    }
                ]
            },
            {
                xtype: 'button',
                itemId: 'adreport',
                action: 'report',
                text: 'Report it!'
            },
            {
                itemId: 'adchatlist'
            },
            {
                xtype: 'titlebar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'message'
                    },
                    {
                        xtype: 'button',
                        action: 'chat',
                        text: 'Chat'
                    }
                ]
            }
        ]
    },

    updateRecord: function () {
        var data = this.getRecord().data;
        this.getAdContent(data);
        this.ajaxGetUserInfo(data.profileId);

    },

    getAdContent: function (data) {
        if (data !== null) {
            this.down('#adfbpicture').setHtml('<div class="adDetailFBPicture"><img src="https://graph.facebook.com/' + data.profileId + '/picture?type=square" /></div>');
            this.down('#adimage').setHtml('<img src="' + data.image + '" />');
            this.down('#addate').setHtml("Posted at: " + data.date);
            this.down('#adtitle').setHtml(data.title);
            this.down('#adprice').setHtml(data.price);
            this.down('#addescription').setHtml(data.description);
            this.down('#adphone').setHtml('<a href="tel:' + data.phone + '">' + data.phone + '</a>');
            this.down('#adsms').setHtml('<a href="SMS:' + data.phone + '">SMS</a>');
            this.down('#adreport').setText("Report it!");
        }
    },

    // ----------------------------------
    // GET FB USER INFO
    // ----------------------------------
    ajaxGetUserInfo: function (profileId) {
        Ext.Ajax.request({
            url: 'https://graph.facebook.com/' + profileId,
            method: 'GET',
            scope: this,
            success: this.onAfterGetUserInfoSuccess,
            failure: this.onAfterGetUserInfoFailure
        });
    },

    onAfterGetUserInfoSuccess: function (response) {
        var data = Ext.JSON.decode(response.responseText.trim());
        this.down('#adname').setHtml(data.name);
    },

    onAfterGetUserInfoFailure: function (response) {
        this.down('#adname').setHtml("Error occurred. Please, check your connection");
    }

});
