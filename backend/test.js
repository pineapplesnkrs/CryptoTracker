var { getPrice, getPriceChange, getVolChange } = require('./coinmarketcap.js');

async function main(){
    console.log('Current Price: ' + await getPrice('BTC'));
    console.log('Price Change (30d): ' + await getPriceChange('BTC', '30d'));
    console.log('Volume Change (24h): ' + await getVolChange('BTC'));
}

main();