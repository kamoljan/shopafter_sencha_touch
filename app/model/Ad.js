Ext.define('ShopAfter.model.Ad', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: '_id',  // avoid duplicates
        fields: [
            { name: "profileId", type: "int" },
            { name: "image", type: "string" },
            { name: "thumb", type: "string" },
            { name: "description", type: "string" },
            { name: "price", type: "int" },
            { name: "phone", type: "string" },
            { name: "loc" },
            {
                name: "date",
                convert: function (value, record) {
                    //2013-10-30T06:53:13.403Z
                    var date = new Date(value);
                    return Ext.Date.format(date, 'M j, Y');
                }

            },
            {
                // FIXME: fix from db itself
                name: "currency",
                convert: function (value, record) {
                    if (typeof value === 'undefined') {
                        return 'SGD';
                    } else {
                        return value;
                    }
                }
            }
        ],
        validations: [
            {
                type: 'presence',
                field: 'description',
                message: "People might not buy your item if they don’t understand what you’re selling. Why not describe it?"
            },
            {
                type: 'presence',
                field: 'price',
                message: "Tell people what your item’s worth!"
            },
            {
                type: 'presence',
                field: 'phone',
                message: "Enter your phone number"
            }
        ]
    }
});