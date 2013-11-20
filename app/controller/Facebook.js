Ext.define('ShopAfter.controller.Facebook', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            '#fbLogin': {
                tap: 'onFacebookLogin'
            }
        }
    },

    init: function () {
        try {
            //alert('(controller.Facebook) Device is ready! Make sure you set your app_id below this alert.');
            FB.init(
                {
                    appId: "723097297716821",
                    nativeInterface: CDV.FB,
                    useCachedDialogs: false
                }
            );
            /* These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory */
            if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) {
                alert('(controller.Facebook) Cordova variable does not exist. Check that you have included cordova.js correctly');
            }
            if (typeof CDV == 'undefined') {
                alert('(controller.Facebook) CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
            }
            if (typeof FB == 'undefined') {
                alert('(controller.Facebook) FB variable does not exist. Check that you have included the Facebook JS SDK file.');
            }
        } catch (e) {
            alert(e);
        }
    },

    onFacebookLogin: function () {
        FB.login(
            function (response) {
                //alert('(controller.Facebook) response = ' + JSON.stringify(response));
                if (response.session) {
                    alert('(controller.Facebook) logged in');
                } else {
                    alert('(controller.Facebook) not logged in');
                }
            },
            { scope: "email" }
        );
    }
});
