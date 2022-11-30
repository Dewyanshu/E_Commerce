const mongoosee = require('mongoose');

module.exports = async function serverStart(){
    await mongoosee.connect('mongodb://127.0.0.1:27017/eCommerceMongoose');
    console.log('Connected to DataBase.')
}