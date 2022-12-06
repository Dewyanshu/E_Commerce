const mongoosee = require('mongoose');
const Schema = mongoosee.Schema;

const productDetailsSchema = new Schema({
    productName: String,
    details: String,
    qty: Number,
    price: String,
    image: String
});

const productDetailsModel = mongoosee.model('productDetails', productDetailsSchema);

module.exports = productDetailsModel;