const { Ticker, TickerModel } = require('../classes/ticker.js');


exports.pushtoDB = async (tickers) => {
    for (let ticker of tickers) {
      try {
        // Search for a ticker with the same symbol in the database
        let existingTicker = await TickerModel.findOne({ symbol: ticker.symbol });
  
        if (!existingTicker) {
          // The ticker does not exist in the database, so save it
          let newTicker = new TickerModel(ticker);
          await newTicker.save();
          console.log(`Ticker ${ticker.symbol} saved!`);
        } else {
          console.log(`Ticker ${ticker.symbol} already exists in the database.`);
        }
      } catch (error) {
        console.error(`Error processing ticker ${ticker.symbol}:`, error);
      }
    }
  };

exports.checkFinanceData = async (existingTicker) => {

        const now = new Date();
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000); // 30 days ago

        if (
            (existingTicker.zero_day !== -1 
            && existingTicker.one_mo !== -1 
            && existingTicker.three_mo !== -1 
            && existingTicker.one_y !== -1) 
            && existingTicker.updatedAt > thirtyDaysAgo
        ) {
            console.log("true");
            return true;
        }  
        else {
            console.log("false");
            return false;
        }
    };

exports.checkMediaData = async (existingTicker) => {

        const now = new Date();
        const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000); // 2 days ago

        if (
            (existingTicker.sentiment !== "") 
            && existingTicker.media_updatedAt > twoDaysAgo
        ) {
            console.log("true");
            return true;
        }  
        else {
            console.log("false");
            return false;
        }
    };

