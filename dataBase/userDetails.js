const mongoosee = require('mongoose');
const Schema = mongoosee.Schema;

const userDetailsSchema = new Schema({
    firstName: String,
	lastName: String,
	mobile: Number,
	email: String,
	password: String,
	isVerified: Boolean
	// mailToken: 
});

const userDetailsModel = mongoosee.model('userDetails', userDetailsSchema);

module.exports = userDetailsModel;