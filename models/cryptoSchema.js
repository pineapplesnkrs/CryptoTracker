//Nick
let mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema(
    {
        _id: String,
        info: {
            price: String,
            priceChange24h: String,
            volChange: String,
        }
    });
    
const cryptoCol = mongoose.model('Crypto', cryptoSchema)

module.exports = cryptoCol;