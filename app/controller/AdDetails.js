Ext.define('ShopAfter.controller.AdDetails', {
    extend: 'Ext.app.Controller',
    config: {
        scrollable: true,
        fullscreen: true,
        tabBarPosition: 'bottom',
        ui: 'light',
        cls: 'addetails',
        record: null,
        layout: 'vbox',
        hidden: true,
        showAnimation: {
            type: 'slideIn',
            direction: 'left',
            duration: 500
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'right',
            duration: 500
        }
    },

    initialize: function () {
        var that = this;
        this.element.on('swipe', function (e) {
            that.fireEvent('swipe', that, e);
        });
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
            content.setHtml(record.get('synopsis'));
            content.getScrollable().getScroller().scrollTo(null, 0, false);
            this.add(this.getCloseButton());
            this.add(header);
            this.add(this.getBtnReport(data._id));
        }
        this.ajaxGetUserInfo(data.profileId);
    },

    getBtnReport: function (ad_id) {
        var that = this;
        if (!this._btnReport) {
            this._btnReport = Ext.create('Ext.Button', {
                text: "Report it!",
                id: 'btnReport',
                listeners: {
                    tap: {
                        //single: true,  // It is ok, for user to send several times
                        fn: function (e) {
                            that.setReport(ad_id);
                        }
                    }
                }
            });
        } else {
            this._btnReport.setText("Report it!");
        }
        return this._btnReport;
    },

    getHeader: function () {
        if (!this._header) {
            this._header = Ext.create('Ext.Container', {
                layout: 'vbox'
            });
        }
        return this._header;
    },

    getContent: function () {
        if (!this._content) {
            this._content = Ext.create('Ext.Container', {
                scrollable: true,
                flex: 1,
                cls: 'content'
            });
        }
        return this._content;
    },

    getHeaderTemplate: function () {
        if (!this._headerTemplate) {
            this._headerTemplate = new Ext.XTemplate(
                '<div class="img" style="background: url({image}) no-repeat;"></div>',
                '<hr class="hr_" />',
                '<div class="info">',
                '<div class="adDetailFBPicture"><img src="https://graph.facebook.com/{profileId}/picture?type=square" /></div>',
                '<strong>{title}</strong><br />',  // FIXME: refactor it w/ proper CSS
                '<div class="adDetailName" id="userName"></div>',
                '<div class="adDetailDate">Posted at: {date}</div>',
                '<div class="adDetailPrice"><span>{currency}</span> {price}</div>',
                '<div class="adDetailDesc"><span></span>{description}</div>',
                '<br />',
                '<p class="adDetailPhone"><a href="tel:{phone}">{phone}</a></p>',
                '<p class="adDetailPhone"><a href="SMS:{phone}">SMS</a></p>',
                '</div>'
            );
        }
        return this._headerTemplate;
    },

    getCloseButton: function () {
        if (!this._closeButton) {
            this._closeButton = Ext.create('Ext.Button', {
                text: "Back",
                action: 'close'
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
                        { scope: 'email' }
                    );
                }
            }
        );
    },

    // ----------------------------------
    // PUT REPORT
    // ----------------------------------
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
    },

    onAfterPutReportSuccess: function (response) {
        this.setMasked(false);
        var btnReport = Ext.getCmp('btnReport');
        btnReport.setText("Thank you :)");
    },

    onAfterPutReportFailure: function (response) {
        this.setMasked(false);
        alert("Error occurred. Please, check your connection");
        alert("server-side failure with status code " + response.status);
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
        this.setMasked(false);
        var data = Ext.JSON.decode(response.responseText.trim()),
            el = Ext.getDom('userName');  //http://www.mysamplecode.com/2012/03/documentgetelementbyid-in-extjs.html
        el.innerHTML = data.name;
    },

    onAfterGetUserInfoFailure: function (response) {
        this.setMasked(false);
        alert("Error occurred. Please, check your connection");
        alert("server-side failure with status code " + response.status);
    }
});