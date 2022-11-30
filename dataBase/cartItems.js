const mongoosee = require('mongoose');
const Schema = mongoosee.Schema;

const cartItemsSchema = new Schema({
    email: String,
    cart: []
});

const cartItemsModel = mongoosee.model('cartItems', cartItemsSchema);

module.exports = cartItemsModel;