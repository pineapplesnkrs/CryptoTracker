const api = require('./coinmarketcap.js');
const dbMan = require("../backend/dbConn.js");
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let cryptoCol = require('../models/cryptoSchema');

async function createCoin(name){
    let doc = new cryptoCol({
        name: name,
        info : {
            price: await api.getPrice(name),
            volChange: await api.getVolChange(name),
            priceChange24h: await api.getPriceChange(name, "24h")
        }
    });
    await doc.save();
}

async function update(){
    const myDb = await dbMan.get("cryptoTracker");
    const coins = await myDb.collection("cryptos").find({}).toArray()
    for (let i = 0; i < coins.length; i++){
        let coin = coins[i]['name'];
        myDb.collection("cryptos").update({name: coin}, {$set: {price: await api.getPrice(coin), volChange: await api.getVolChange(coin), priceChange24h: await api.getPriceChange(coin, "24h")}});
    }
}

createCoin("BTC");

module.exports = { update };