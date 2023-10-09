const { Ticker, TickerModel } = require('../classes/ticker.js');


exports.pushtoDB = async (tickers) => {
  console.log("Checking Database...")
    for (let ticker of tickers) {
      try {
        // Search for a ticker with the same symbol in the database
        let existingTicker = await TickerModel.findOne({ symbol: ticker.symbol });
  
        if (!existingTicker) {
          // The ticker does not exist in the database, so save it
          let newTicker = new TickerModel(ticker);
          await newTicker.save();
          //console.log(`Ticker ${ticker.symbol} saved!`);
        } else {
          //console.log(`Ticker ${ticker.symbol} already exists in the database.`);
        }
      } catch (error) {
        console.error(`Error processing ticker ${ticker.symbol}:`, error);
      }
    }
  };

exports.checkArxivData = async (existingTicker) => {
  console.log("Checking Research Database...");
  const now = new Date();
  const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000);
  console.log(fiveDaysAgo);
  console.log(existingTicker.updatedAt);
  if(existingTicker.updatedAt > fiveDaysAgo){
    console.log("Cached Research Data Found.");
    return true;
  }else{
    console.log("Cached Research Data Not Found.");
    return false;
  }
}

exports.checkFinanceData = async (existingTicker) => {
  console.log("Checking Financial Database...");
        const now = new Date();
        const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000); // 30 days ago
        console.log(existingTicker.updatedAt);
        console.log(fiveDaysAgo);
        if (
            (existingTicker.zero_day !== -1 && existingTicker.one_mo !== -1 && existingTicker.three_mo !== -1 && existingTicker.one_y !== -1) && existingTicker.updatedAt > fiveDaysAgo) {
            //console.log("true");
            console.log("Cached Finance Data Found.");
            return true;
        }  
        else {
           // console.log("false");
           console.log("Cached Finance Data Not Found.");
            return false;
        }
    };

exports.checkMediaData = async (existingTicker) => {
  console.log("Checking Media Database...");
        const now = new Date();
        const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        console.log(existingTicker.media_updatedAt);
        console.log(twoDaysAgo);
        if (
            (existingTicker.sentiment !== "") 
            && existingTicker.media_updatedAt > twoDaysAgo
        ) {
            console.log("Cached Media Data Found.");
            return true;
        }  
        else {
            console.log("Cached Media Data Not Found.");
            return false;
        }
    };

