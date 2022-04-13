const axios = require('axios');
let apiKey = 'c082831b-42ea-44cf-9e2f-f797d8b31cfc';

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
    let priceInfo = await getInfo(coin);
    let priceData = priceInfo['data']['BTC'][0]['quote']['USD']['price'];
    return Math.round(priceData * 100) / 100;
}

//get the % volume change in the past 24 hours
async function getVolChange(coin) {
    let volInfo = await getInfo(coin);
    let volData = volInfo['data']['BTC'][0]['quote']['USD']['volume_change_24h'];
    return Math.round(volData * 100) / 100;
}

//gets the % price change in the specified time period
//valid time periods [ 1h, 24h, 7d, 30d, 60d, 90d ]
async function getPriceChange(coin, time) {
    let changeInfo = await getInfo(coin);
    let changeData = '';
    switch (time) {
        case '1h':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_1h'];
            break;
        case '24h':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_24h'];
            break;
        case '7d':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_7d'];
            break;
        case '30d':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_30d'];
            break;
        case '60d':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_60d'];
            break;
        case '90d':
            changeData = changeInfo['data']['BTC'][0]['quote']['USD']['percent_change_90d'];
            break;
        default:
            changeData = 'Invalid Time';
    }
    return Math.round(changeData * 100) / 100;
}

module.exports = { getPrice, getVolChange, getPriceChange };