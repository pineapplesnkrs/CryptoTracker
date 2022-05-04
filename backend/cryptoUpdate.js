const api = require('./api.js');


async function update(){
    const coins = await myDb.collection("cryptos").find({}).toArray()
    for (let i = 0; i < coins.length; i++){
        let coin = coins[i]['name'];
        myDb.collection("cryptos").update({name: coin}, {$set: {price: await api.getPrice(coin), volChange: await api.getVolChange(coin), priceChange24h: await api.getPriceChange(coin, "24h")}});
    }
}

module.exports = { update };