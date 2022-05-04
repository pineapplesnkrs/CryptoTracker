//Nick
const axios = require('axios');
const apiKey = 'c082831b-42ea-44cf-9e2f-f797d8b31cfc';

async function getInfo(coin) {
    try {
        response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coin}`, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });
    } catch (err) {
        response = null;
        return err;
    }
    if (response) {
        return response.data
    }
}

//gets the current price
async function getPrice(coin) {
    let info = await getInfo(coin);
    let data = info['data'][coin][0]['quote']['USD']['price'];
    return "$" + Math.round(data * 100) / 100;
}

//get the % volume change in the past 24 hours
async function getVolChange(coin) {
    let info = await getInfo(coin);
    let data = info['data'][coin][0]['quote']['USD']['volume_change_24h'];
    return (Math.round(data * 100) / 100) + "%";
}

//gets the % price change in the specified time period
//valid time periods [ 1h, 24h, 7d, 30d, 60d, 90d ]
async function getPriceChange(coin, time) {
    let info = await getInfo(coin);
    let data = info['data'][coin][0]['quote']['USD'][`percent_change_${time}`];
    if(!data){
        return "Invalid Time"
    } else{
        return (Math.round(data * 100) / 100) + "%";
    }
}

module.exports = { getPrice, getVolChange, getPriceChange };