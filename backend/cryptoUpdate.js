//Nick
const api = require('./coinmarketcap.js');
const dbMan = require("../backend/dbConn.js");
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let cryptoCol = require('../models/cryptoSchema');

async function createCoin(name){
    let doc = new cryptoCol({
        _id: name,
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
    //console.log(coins)
    for (let i = 0; i < coins.length; i++){
        let coin = coins[i]['_id'];
        myDb.collection("cryptos").update({_id: coin}, 
        {$set: {
            info: {
                price: await api.getPrice(coin), 
                volChange: await api.getVolChange(coin), 
                priceChange24h: await api.getPriceChange(coin, "24h")
            }
        }});
        console.log("updated " + coin)
    }
}

async function run(){
    await mongoose.connect('mongodb://localhost:27017/cryptoTracker', { useNewUrlParser: true, useUnifiedTopology: true })
    await createCoin("MATIC");
    console.log("added")
}

//run()
//update()