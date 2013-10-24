var fN = function () {
    var name = '';
    return {
        set_name: function (p) {
            name = p;
        },
        get_name: function () {
            return name;
        }
    };
};
var fn = fN();

Ext.define('ShopAfter.controller.InsertAdForm', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            '#saveAdForm': {
                tap: 'validateAdForm'
            },
            '#adphoto': {
                tap: 'tabPhoto'
            }
        }
    },

    tabPhoto: function () {
        console.log('controller.Ads uploadPhoto');
        navigator.camera.getPicture(
            function (imageURI) {
                alert("imageURI = " + imageURI);
                uploadPhoto(imageURI);
            },
            function (message) {
                alert('Failed: ' + message);
            },
            {
                quality: 100,
                targetWidth: 300,
                targetHeight: 300,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            }
        )

        function uploadPhoto(imageURI) {
            var img = Ext.ComponentQuery.query('image')[0];
            img.setSrc(imageURI);

            // consider a more reliable way to generate unique ids
            var fileName = "" + (new Date()).getTime() + ".jpg";

            var ft = new FileTransfer(),
                op = new FileUploadOptions();
            op.fileKey = "file";
            op.fileName = fileName;
            op.mimeType = "image/jpeg";
            op.chunkedMode = false;
            op.httpMethod = "POST";
            Ext.Ajax.request({
                url: 'http://shopafter.com:3000/signing',
                scope: this,  // need this to be able access the controller scope
                method: 'POST',
                params: {
                    "fileName": fileName
                },
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    var params = {
                        "key": fileName,
                        "AWSAccessKeyId": obj.awsKey,
                        "acl": "public-read",
                        "policy": obj.policy,
                        "signature": obj.signature,
                        "Content-Type": "image/jpeg"
                    };
                    op.params = params;
                    var aws_url = encodeURI("http://" + obj.bucket + ".s3.amazonaws.com/");
                    ft.upload(imageURI, aws_url, win, fail, op);
                    function win(r) {
                        alert("r = " + JSON.stringify(r));
                        if (r.responseCode === 204) {
                            alert("true r.responseCode = " + r.responseCode);
                            fn.set_name(fileName);
                        } else {
                            alert("S3 returned not 204");
                            fn.set_name("");
                        }
                        console.log("Code = " + r.responseCode);
                        console.log("Response = " + r.response);
                        console.log("Sent = " + r.bytesSent);
                    }

                    function fail(error) {
                        alert("Error = " + JSON.stringify(error));
                        fn.set_name("");
                    }
                },
                failure: function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                    alert('server-side failure with status code ' + response.status);
                }
            });
        }
    },

    validateAdForm: function (button, e, options) {
        console.log('controller.Ads validateAdForm');
        var errorString = '',
            form = Ext.getCmp('insertadform'),
            fields = form.query('field');
        for (var i = 0; i < fields.length; i++) {
            fields[i].removeCls('invalidField');
        }
        var model = Ext.create('ShopAfter.model.Ad', form.getValues());
        var errors = model.validate();
        if (!errors.isValid()) {
            errors.each(function (errorObj) {
                errorString += '* ' + errorObj.getMessage() + '\n\n';
                var f = errorObj.getField();
                var s = Ext.String.format('field[name={0}]', f);
                //FIXME: need validation for category_id
                alert('controller.Ads s = %s, f = %f', s, f);
                if (f !== 'image') {
                    form.down(s).addCls('invalidField');
                }
            });
            alert(errorString);
            return false;
        }
        if (fn.get_name() === "") {
            alert('The pictures help you sell better, please upload them now!');
            return false;
        }
        Ext.getCmp('insertadform').setMasked({
            xtype: 'loadmask',
            message: 'Posting your ad ...'
        });
        this.getLocation();
        return true;
    },

    postAd: function (lat, lon) {
        alert('controller.Ads postAd');
        var form = Ext.getCmp('insertadform'),
            values = form.getValues();
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/ad',
            scope: this,  //need this to be able access the controller scope
            method: 'POST',
            params: {
                image: fn.get_name(),
                category: values.category,
                description: values.description,
                price: values.price,
                phone: values.phone,
                latitude: lat,
                longitude: lon
            },
            callback: function (success) {
                if (success) {
                    this.onAdIconTap();
                } else {
                    alert('Error occurred. Please, check your connection');
                }
                Ext.getCmp('insertadform').setMasked(false);
            }
        });
    },

    getLocation: function () {
        alert('controller.Ads updateLocation');
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                scope: this,  //need this to be able access the controller scope
                locationupdate: function (geo) {
                    //Asynchronously coming here
                    this.postAd(geo.getLatitude(), geo.getLongitude());
                },
                locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout) {
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred. Please, enable your Location access');
                    }
                    Ext.getCmp('insertadform').setMasked(false);
                }
            }
        });
        geo.updateLocation();
    }

})
;