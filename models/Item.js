const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    country : {
        type : String,
        default : 'Indonesia'
    },
    city : {
        type : String,
        required : true
    },
    isPopuler : {
        type : Boolean  ,
    },
    description : {
        type : String,
        required : true
    },
    imageId  :[{
        type : ObjectId,
        ref : 'Image'
    }],
    featureId : [{
        type : ObjectId,
        ref : 'Feature'
    }],

    actifitiId : [{
        type : ObjectId,
        ref : 'Feature'
    }]
});


module.exports = mongoose.model('Item',itemSchema);

