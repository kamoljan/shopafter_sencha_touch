Ext.define('ShopAfter.controller.AdDetails', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.InputBlocker',
        'ShopAfter.view.AdDetails'
    ],
    config: {
        adDetailsVisible: false,  // Handling Android backbutton
        adId: null,
        refs: {
            adDetails: '#addetails',
            message: '#message',
            chatlist: '#chatlist'
        },
        control: {
            'adslistview > list': {
                itemtap: function (list, index, item, record, event) {
                    this._adDetails = this.openAdDetails();
                    this._adDetails.setRecord(record);
                    Ext.Viewport.add(this._adDetails);
                    Ext.util.InputBlocker.blockInputs();
                    this._adDetails.on({
                        show: {
                            fn: function () {
                                list.deselectAll(true);
                            },
                            scope: this,
                            single: true
                        }
                    });
                    this.setAdDetailsVisible(true);  // Handling Android backbutton
                    this._adDetails.show();
                    this.setAdId(record.data._id);
                    this.getPubNubHistory(this.getAdId());
                    this.subscribePubNub(this.getAdId());
                }
            },
            'addetails > button[action="report"]': {
                tap: 'doReport'
            },
            'addetails > button[action="close"]': {
                tap: function (button) {
                    var details = button.up("addetails");
                    details.hide();
                    Ext.util.InputBlocker.unblockInputs();
                }
            },
            'button[action="chat"]': {
                tap: function (button) {
                    var msg = {
                            "user": "618592936",
                            "message": this.getMessage().getValue()
                        },
                        channel = this.getAdId();
                    this.publishPubNub(channel, msg);
                }
            }
//            'button[action="chat"]': {
//                tap: function (button) {
//                    alert('0');
//                    var that = this,
//                        msg = this.getMessage().getValue(),
//                        channel = this.getAdId();
//                    FB.getLoginStatus(
//                        function (response) {
//                            alert(JSON.stringify(response));
//                            if (response.status === 'connected') {
//                                alert(JSON.stringify(response));
//                                that.publishPubNub(channel, msg, response.authResponse.userID || response.authResponse.userId);
//                            } else {
//                                FB.login(
//                                    function (response) {
//                                        if (response.status === 'connected') {
//                                            that.publishPubNub(channel, msg, response.authResponse.userID || response.authResponse.userId);
//                                        } else {
//                                            alert("Sorry, please connect to Facebook account to report.");
//                                        }
//                                    },
//                                    { scope: 'email' }
//                                );
//                            }
//                        }
//                    );
//                }
//            }
        }
    },

    subscribePubNub: function (channel) {
        console.log("subscribePubNub channel = " + channel);
        var myStore = Ext.getStore('Chats');
        pubnub.subscribe({
            channel: channel,
            callback: function (response) {
                console.log(JSON.stringify(response));
                myStore.insert(0, {user: response.user, message: response.message});
            }
        });
    },

    publishPubNub: function (channel, message) {
        console.log("publishPubNub channel = " + channel);
        pubnub.publish({
            channel: channel,
            message: message
        });
    },

    getPubNubHistory: function (channel) {
        console.log("getPubNubHistory channel = " + channel);
        var myStore = Ext.getStore('Chats');
        myStore.removeAll();
        pubnub.history({
            channel: channel,
            count: 100,
            //start: start,
            //end: end,
            //reverse: reverse ? 'true' : 'false',
            reverse: true,
            callback: function (response) {
                console.log("getPubNubHistory history");
                console.dir(JSON.stringify(response[0]));
                for (x in response[0]) {
                    console.log("user = " + response[0][x].user);
                    console.log("message = " + response[0][x].message);
//                    myStore.insert(0, {txt: JSON.stringify(response[0][x])});
//                    myStore.insert(0, response[0][x].user, response[0][x].message);
                    myStore.insert(
                        0,
                        {
                            user: JSON.stringify(response[0][x].user),
                            message: JSON.stringify(response[0][x].message)
                        }
                    );
                }
            }
        });
    },

    openAdDetails: function () {
        if (!this._adDetails) {
            this._adDetails = Ext.create("ShopAfter.view.AdDetails");
        }
        return this._adDetails;
    },

    doReport: function () {
        var that = this;
        this.getAdDetails().setMasked({
            xtype: 'loadmask',
            message: 'Reporting ...'
        });
        FB.getLoginStatus(
            function (response) {
                if (response.status === 'connected') {
                    that.ajaxPutReport(that.getAdId(), response.authResponse.userID || response.authResponse.userId);
                } else {
                    FB.login(
                        function (response) {
                            if (response.status === 'connected') {
                                that.ajaxPutReport(that.getAdId(), response.authResponse.userID || response.authResponse.userId);
                            } else {
                                alert("Sorry, please connect to Facebook account to report.");
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
        this.getAdDetails().setMasked(false);
        this.getBtnReport().setText("Thank you :)");
    },

    onAfterPutReportFailure: function (response) {
        this.getAdDetails().setMasked(false);
        this.getBtnReport().setText("Please, check your connection");
    }
})
;