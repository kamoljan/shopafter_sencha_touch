Ext.define('ShopAfter.view.AdDetails', {
    extend: 'Ext.Container',
    xtype: "addetails",

    requires: [],

    config: {
        fullscreen: true,
        tabBarPosition: "bottom",
        ui: 'light',
        cls: " addetails",
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

    initialize: function() {
        var me = this;
        this.element.on("swipe", function(e) {
            me.fireEvent("swipe", me, e);
        })
    },

    updateRecord: function() {
        this.removeAll(false);
        this.createView();
    },

    createView: function() {
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

            if (content.getHtml().length > 0) {
                this.add(content);
            }
        }
    },

    getHeader: function() {
        if (!this._header) {
            this._header = Ext.create("Ext.Container", {
                layout: "vbox"
            });
        }
        return this._header;
    },

    getContent: function() {
        if (!this._content) {
            this._content = Ext.create("Ext.Container", {
                scrollable: true,
                flex: 1,
                cls: "content"
            });
        }
        return this._content;
    },

    getHeaderTemplate: function() {
        if (!this._headerTemplate) {
            this._headerTemplate = new Ext.XTemplate(
                '<div class="title">{date}</div>',
                '<div class="img" style="background-image: url({image}); background-repeat: no-repeat;"></div>',
                '<div class="info">',
                    '<div class="fbProfilePic"><img src="https://graph.facebook.com/{profileId}/picture?type=square" /></div>',
                    '<div class="rating">{description}</div>',
                    '<div class="vbox vbox-isk">',
                        '<div class="year">price: {price}</div>',
                        '<p>Phone number: <a href="tel:+{phone}">{phone}</a></p>',
                    '</div>',
                '</div>',
                '<tpl if="abridged_cast.length &gt; 0">',
                    '<ul class="cast">',
                        '<tpl for="abridged_cast">',
                        '<li>{name}</li>',
                        '</tpl>',
                    '</ul>',
                '</tpl>'
            )
        }
        return this._headerTemplate;
    },
    getCloseButton: function() {
        if (!this._closeButton) {
            this._closeButton = Ext.create('Ext.Button', {
                text: "close",
                action: "close"
            })
        }

        return this._closeButton;
    }
});