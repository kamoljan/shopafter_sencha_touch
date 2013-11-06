Ext.define('ShopAfter.view.AdDetails', {
    extend: 'Ext.Container',
    xtype: "addetails",
    requires: [],
    config: {
        fullscreen: true,
        tabBarPosition: "bottom",
        ui: 'light',
        cls: "addetails",
        record: null,
        layout: "vbox",
        hidden: true,
        showAnimation: {
            type: "slideIn",
            direction: "down",
            duration: 500
        },
        hideAnimation: {
            type: "slideOut",
            direction: "up",
            duration: 500
        }
    },

    initialize: function () {
        var me = this;
        this.element.on("swipe", function (e) {
            me.fireEvent("swipe", me, e);
        })
    },

    updateRecord: function () {
        this.removeAll(false);
        this.createView();
    },

    createView: function () {
        var record = this.getRecord();
        if (record) {
            var header = this.getHeader(),
                content = this.getContent(),
                data = record.data;
            header.setHtml(this.getHeaderTemplate().apply(data));
            content.setHtml(record.get("synopsis"));
            content.getScrollable().getScroller().scrollTo(null, 0, false);
            this.add(this.getCloseButton());
            this.add(header);
        }
    },

    getHeader: function () {
        if (!this._header) {
            this._header = Ext.create("Ext.Container", {
                layout: "vbox"
            });
        }
        return this._header;
    },

    getContent: function () {
        if (!this._content) {
            this._content = Ext.create("Ext.Container", {
                scrollable: true,
                flex: 1,
                cls: "content"
            });
        }
        return this._content;
    },

    getHeaderTemplate: function () {
        if (!this._headerTemplate) {
            this._headerTemplate = new Ext.XTemplate(
                '<div class="img" style="background-image: url({image}); background-repeat: no-repeat;"></div>',
                '<hr class="hr_" />',
                '<div class="info">',
                '<div class="fbProfilePic"><img src="https://graph.facebook.com/{profileId}/picture?type=square" /></div>',
                '<span class="userName">&nbsp;</span>',
                '<div class="adDetailData">Posted at: {date}</div>',

                '<div class="vbox vbox-isk">',
                '<div class="adDetailPrice"><span>{currency}</span> {price}</div>',
                '<p class="adDetailPhone"><a href="tel:+{phone}">{phone}</a></p>',
                '<div class="adDetailDesc"><span></span>{description}</div>',
                '</div>',
                '</div>'
            )
        }
        return this._headerTemplate;
    },

    getCloseButton: function () {
        if (!this._closeButton) {
            this._closeButton = Ext.create('Ext.Button', {
                text: "Back",
                action: "close"
            })
        }
        return this._closeButton;
    }

});