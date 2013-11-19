Ext.define('ShopAfter.view.AdDetails', {
    extend: 'Ext.Container',
    xtype: "addetails",
    requires: [],
    config: {
        scrollable: true,
        fullscreen: true,
        tabBarPosition: "bottom",
        ui: 'light',
        cls: "addetails",
        record: null,
        layout: "vbox",
        hidden: true,
        showAnimation: {
            type: "slideIn",
            direction: "left",
            duration: 500
        },
        hideAnimation: {
            type: "slideOut",
            direction: "right",
            duration: 500
        }
    },

    initialize: function () {
        var me = this;
        this.element.on("swipe", function (e) {
            me.fireEvent("swipe", me, e);
        });
    },

    updateRecord: function () {
        this.removeAll(false);
        this.createView();
    },

    createView: function () {
        that = this;
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

            var btnReport = Ext.Viewport.add({
                xtype: 'button',
                text: "Report it!",
                id: 'btnReport',
                listeners: {
                    tap: {
                        single: true,
                        fn: function (e) {
                            that.setReport(record.data._id);
                        }
                    }
                }
            });

            this.add(btnReport);
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
                '<div class="adDetailDesc"><span></span>{description}</div>',
                '<br />',
                '<p class="adDetailPhone"><a href="tel:+{phone}">{phone}</a></p>',
                '<p class="adDetailPhone"><a href="SMS:{phone}">SMS</a></p>',
                '</div>',
                '</div>'
            );
        }
        return this._headerTemplate;
    },

    getCloseButton: function () {
        if (!this._closeButton) {
            this._closeButton = Ext.create('Ext.Button', {
                text: "Back",
                action: "close"
            });
        }
        return this._closeButton;
    },

    setReport: function (ad_id) {
        var that = this;
        this.setMasked({xtype: 'loadmask', message: 'Reporting ...'});
        FB.getLoginStatus(
            function (response) {
                if (response.status === 'connected') {
                    that.ajaxPutReport(ad_id, response.authResponse.userId);
                } else {
                    FB.login(
                        function (response) {
                            if (response.status === 'connected') {
                                that.ajaxPutReport(ad_id, response.authResponse.userId);
                            } else {
                                alert("Sorry, please connect to Facebook account to report." +
                                    "Don't worry, we won't share anything without your okay. Promise!");
                            }
                        },
                        { scope: "email" }
                    );
                }
            }
        );
    },

    onAfterPutReportSuccess: function (response) {
        this.setMasked(false);
        var btnReport = Ext.getCmp('btnReport');
        btnReport.setText('Thank you');
    },

    onAfterPutReportFailure: function (response) {
        this.setMasked(false);
        alert('Error occurred. Please, check your connection');
        alert('server-side failure with status code ' + response.status);
    },

    ajaxPutReport: function (ad_id, user_id) {
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/report/' + ad_id,
            method: 'PUT',
            params: {
                profileId: user_id
            },
            scope: this,
            success: this.onAfterPutReportSuccess,
            failure: this.onAfterPutReportFailure
        });
    }
});