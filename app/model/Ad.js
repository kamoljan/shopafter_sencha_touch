Ext.define('ShopAfter.model.Ad', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: '_id',  // avid duplicates
        fields: [
            { name: "image", type: "string" },
            { name: "thumb", type: "string" },
            { name: "description", type: "string" },
            { name: "price", type: "int" },
            { name: "phone", type: "string" },
            { name: "loc" },
            { name: "date" }
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