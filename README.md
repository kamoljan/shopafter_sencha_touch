# ShopAfter - Native Apps


## Prerequisites
#### Platform requirements:
* ST 2.3
* CMD 4
* PhoneGap

#### Server Side
In `server-side` run

    node server.js

Login into mongodb by `mongo` command and run

    db.addUser( { user: "admin", pwd: "12345678", roles: ["readWrite", "dbAdmin"] } )

## Web app (http://localhost:1841/)

    sencha web start
    
## Android app

    sencha app build -run native
    
Scan the qrcode or to install apk file into your local emulator/device, run

    adb uninstall com.shopafter.ShopAfter; sencha app build native; adb install ./phonegap/platforms/android/bin/ShopAfter-debug.apk
    
## Notes
The following plugins are installed and commited into the source code:
* Camera
* FileTransfer
* Geolocation

However, if you wish to upgrate to latest phonegap plugins run the following code from `phonegap/plugins` dir

    phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
    phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git
    phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git





