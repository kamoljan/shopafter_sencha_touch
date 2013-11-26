Ext.define('ShopAfter.view.MyCorner', {
    extend: 'ShopAfter.view.AdsListView',
    xtype: 'mycorner',

    create: function () {
        var that = this;
        FB.getLoginStatus(
            function (response) {
                if (response.status === 'connected') {
                    that.setCreateIfConnected(response.authResponse.userId);
                } else {
                    FB.login(
                        function (response) {
                            if (response.status === 'connected') {
                                that.setCreateIfConnected(response.authResponse.userId);
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

    setCreateIfConnected: function () {
        var profile = this.getProfileBox();
        var data = {
            profileId: 633194612,
            date: "Today",
            price: 232
        };

        this.removeAll(false);
        this.add(this.getHeaderBar());
        this.add(profile.setHtml(this.getProfileTemplate().apply(data)));
        this.add(this.getList());
        this.down("list").getStore().load();
    },

    setCreateIfNotConnected: function () {

    },

    getProfileBox: function () {
        if (!this._profile) {
            this._profile = Ext.create('Ext.Container', {
                layout: 'vbox'
            });
        }
        return this._profile;
    },

    getProfileTemplate: function () {
        if (!this._headerTemplate) {
            this._headerTemplate = new Ext.XTemplate(
                '<div class="img" style="background-image: url({image}); background-repeat: no-repeat;"></div>',
                '<hr class="hr_" />',
                '<div class="info">',
                '<div class="fbProfilePic"><img src="https://graph.facebook.com/{profileId}/picture?type=square" /></div>',
                '<span class="userName">&nbsp;</span>',
                '<link rel="import" href="https://graph.facebook.com/{profileId}?fields=name">',
                '<img src="https://graph.facebook.com/{profileId}?fields=name" />',
                '</div>',
                '</div>'
            );
        }
        return this._headerTemplate;
    }

//    getUserInfo: function () {
//        FB.api(
//            '/me',
//            {
//                fields: 'name,first_name,picture'
//            },
//            function (response) {
//                console.log(response);
//                var output = '';
//                output += '<img src="' + response.picture.data.url + '" width="25" height="25"></img>';
//                output += ' ' + response.first_name;
//                alert("output = " + output);
//            }
//        );
//    }
});