Ext.define('ShopAfter.controller.InsertAdForm', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            '#saveAdForm': {
                tap: 'validateAdForm'
            },
            '#adphoto': {
                tap: 'uploadPhoto'
            }
        }
    },

    uploadPhoto: function () {
        var s3Uploader = (function () {
            var signingURI = "http://shopafter:3000/signing";

            function upload(imageURI, fileName) {
                var deferred = $.Deferred(),
                    ft = new FileTransfer(),
                    options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileName;
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                $.ajax({url: signingURI, data: {"fileName": fileName}, dataType: "json", type: "POST"})
                    .done(function (data) {
                        options.params = {
                            "key": fileName,
                            "AWSAccessKeyId": data.awsKey,
                            "acl": "public-read",
                            "policy": data.policy,
                            "signature": data.signature,
                            "Content-Type": "image/jpeg"
                        };
                        ft.upload(imageURI, "https://" + data.bucket + ".s3.amazonaws.com/",
                            function (e) {
                                deferred.resolve(e);
                            },
                            function (e) {
                                alert("Upload failed");
                                deferred.reject(e);
                            }, options);
                    })
                    .fail(function (error) {
                        console.log(JSON.stringify(error));
                    });
                return deferred.promise();
            }

            return {
                upload: upload
            }
        }());

        navigator.camera.getPicture(
            function (imageURI) {
                console.log(imageURI);
                uploadPhoto(imageURI);
            },
            function (message) {
                alert('Failed: ' + message);
            },
            {
                quality: 85,
                targetWidth: 200,
                targetHeight: 200,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            }
        )

        function uploadPhoto(imageURI) {
            var img = Ext.ComponentQuery.query('image')[0];
            img.setSrc(image_uri);

            var fileName = "" + (new Date()).getTime() + ".jpg"; // consider a more reliable way to generate unique ids
            s3Uploader.upload(imageURI, fileName)
                .done(function () {
                    alert("S3 upload succeeded");
                })
                .fail(function () {
                    alert("S3 upload failed");
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
                console.log('controller.Ads s = %s', s);
                console.log('controller.Ads f = %s', f);
                if (f !== 'image') {
                    form.down(s).addCls('invalidField');
                }
            });
            alert(errorString);
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
        var form = Ext.getCmp('insertadform'),
            capture = form.down('capturepicture'),
            values = form.getValues();
        Ext.Ajax.request({
            url: '/ad',
            scope: this,  //need this to be able access the controller scope
            method: 'POST',
            params: {
                image: capture.getImageDataUrl(),
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
        console.log('controller.Ads updateLocation');
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

});