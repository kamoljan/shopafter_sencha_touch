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

## Launch Web app (http://localhost:1841/)

    sencha web start
    
## Launch Android app

    sencha app build -run native
    
Scan the qrcode or install into your local emulator/device by running

    adb uninstall com.shopafter.ShopAfter; sencha app build native; adb install ./phonegap/platforms/android/bin/ShopAfter-debug.apk



