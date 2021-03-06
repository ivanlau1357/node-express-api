const logger = require('../../loggerConfig/logger')
const Promise = require("bluebird");
const CryptonatorService = require('./CryptonatorService')

class StockService {
    static async getStockPrice(stocks) {
        logger.log('info', {
            category: 'StockService',
            payload: {
                stocks,
                stage: 'DoGetStockPrice',
            }
        });
        
        const stocksRes = await Promise.map(stocks, async(stock) => {
            const stockKey = this.stockKeyMapper(stock);
            const stockTicker = await CryptonatorService.getStockInfo(stockKey)

            if(!stockTicker) {
                const defaultCase = await CryptonatorService.getStockInfo('btc');
                return {
                    name: 'bitcoin',
                    price: defaultCase?.price,
                    volume: defaultCase?.volume,
                    change: defaultCase?.change
                }
            }

            return {
                name: stock,
                price: stockTicker?.price,
                volume: stockTicker?.volume,
                change: stockTicker?.change
            }        
        })
      
      return stocksRes
    }

    static stockKeyMapper(stock) {
        const map = {
            bitcoin: 'btc',
            ether: 'eth',
            litecoin:'ltc',
            monero: 'xmr',
            ripple: 'xrp',
            dogecoin: 'doge',
            dash: 'dash',
            maidsafeecoin: 'maid',
            lisk: 'lsk',
            storjconX: 'sjcx',
        }
        return map[stock]

    }
  }
  
module.exports = StockService