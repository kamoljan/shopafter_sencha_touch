Ext.define('ShopAfter.model.Ad', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
//            { name: "profileId", type: "int" },
            { name: "image", type: "string" },
            { name: "thumb", type: "string" },
            { name: "Number", type: "int" },
            { name: "description", type: "string" },
            { name: "price", type: "int" },
            { name: "phone", type: "string" },
            { name: "loc" },
            { name: "date" }
        ],
        validations: [
//            {
//                type: 'presence',
//                field: 'category',
//                message: 'The right category helps people find your item faster'
//            },
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