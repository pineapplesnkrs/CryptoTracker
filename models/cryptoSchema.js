let mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema(
    {
        name: String,
        info: {
            price: Number,
            priceChange24h: Number,
            volChange: Number,
        }
    });
    
const cryptoCol = mongoose.model('Crypto', cryptoSchema)

module.exports = cryptoCol;