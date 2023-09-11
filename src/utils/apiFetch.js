const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();
const { checkFinanceData, checkMediaData } = require('../utils/dbFunctions.js');

const { Ticker, TickerModel } = require('../classes/ticker.js');
const { PaperCountModel, VisitCountModel } = require('../classes/countSchema.js');
const { computePercentages } = require('./dataAggregation.js');

const now = new Date();

const arxivCategories = [
    'astro-ph',  // Astrophysics
    'cond-mat',  // Condensed Matter
    'cs',        // Computer Science
    'econ',      // Economics
    'eess',      // Electrical Engineering and Systems Science
    'gr-qc',     // General Relativity and Quantum Cosmology
    'hep-ex',    // High Energy Physics - Experiment
    'hep-lat',   // High Energy Physics - Lattice
    'hep-ph',    // High Energy Physics - Phenomenology
    'hep-th',    // High Energy Physics - Theory
    'math',      // Mathematics
    'nlin',      // Nonlinear Sciences
    'nucl-ex',   // Nuclear Experiment
    'nucl-th',   // Nuclear Theory
    'physics',   // Physics
    'q-bio',     // Quantitative Biology
    'q-fin',     // Quantitative Finance
    'quant-ph',  // Quantum Physics
    'stat',      // Statistics
  ];

// Query Delay Time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache Values, will add to DynamoDB later
let cache = {};

  // Formats the current date into a string suitable for a ArXiv query.
const getArxivCurrentDate = () => {
    // Create a new Date object
    let date = new Date();

    // Get the year, month, day, hour and minute
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Months are zero-based
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // Pad with zeros if needed
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;

    // Concatenate the parts
    let arxivDate = year + month + day + hour + minute;
    return arxivDate
}
  


  const getArxivCount = async (category, lookbackPeriod) => {
    const existingcount = await PaperCountModel.findOne({industry: category, lookback_period: lookbackPeriod})
    
    if (existingcount) {
        return existingcount.count;
      }
    // Wait for 3.5 seconds before the next API call
    await delay(3000);
    const date = new Date();
    date.setMonth(date.getMonth() - lookbackPeriod);
    const startDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}0000`;
    const currentDate = getArxivCurrentDate();
    
    //DEUBG
    //console.log(`Start Date: ${startDate}`);
    //console.log(`Current Date: ${currentDate}`);

    const apiUrl = `https://export.arxiv.org/api/query?search_query=cat:${category}*+AND+submittedDate:[${startDate}+TO+${currentDate}]&max_results=1000`;  

  
  const response = await fetch(apiUrl);
  const data = await response.text();

  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (err, result) => {
      if (err) {
        return reject(err);
      }
      
      //console.log(`Parsed XML for ${category}:`, result);

      if (result.feed && result.feed['opensearch:totalResults']) {
        const totalResults = result.feed['opensearch:totalResults'][0];
        const count = totalResults['_']; 
        console.log(`Total Results for ${category}:`, count);
        let new_PaperCount = new PaperCountModel({industry: category, lookback_period: lookbackPeriod, count: count});
        new_PaperCount.save();
        resolve(parseInt(count, 10));
      } else {
        console.log(`No total results for ${category}`);
        resolve(0);
      }
    });
  });
};
  
  


const getTotalPapersInMonths = async (lookbackPeriod) => {
        let mostPapers = 0;
        let mostPapersCategory = null;
      
        for (const category of arxivCategories) {
          const count = await getArxivCount(category, lookbackPeriod);
          console.log(`Category: ${category}, Papers: ${count}`);
      
          // Check if this category has more papers than the previous maximum
          if (count > mostPapers) {
            mostPapers = count;
            mostPapersCategory = category;
          }
        }
      
        console.log(`Category with the most papers published in the last ${lookbackPeriod} months: ${mostPapersCategory} with ${mostPapers} papers.`);
        return { mostPapersCategory, mostPapers };
    };

exports.fetchARXIVData = async (lookbackPeriod) => {
    try {
        const result = await getTotalPapersInMonths(lookbackPeriod);
        console.log(`The category with the most papers is ${result.mostPapersCategory}`);
        return result;
    } catch (error) {
        console.error(error);
    }
};

const constructMediaQuery = async (ticker) => {
  const apiUrl = `https://api.marketaux.com/v1/news/all?symbols=${ticker.symbol}&filter_entities=true&language=en&api_token=${process.env.MARKETAUX_API_KEY}`
  const response = await fetch(apiUrl);
  const data = await response.json();

  return data
}

const getMediaSentiment = async (tickers) => {
  for(ticker of tickers){
    const existingTicker = await TickerModel.findOne({ symbol: ticker.symbol });
    if (existingTicker) {
      if(checkMediaData == true){
        ticker.sentiment = existingTicker.sentiment;
      }else {
      const MediaResult = await constructMediaQuery(ticker);
      const average_sentiment = (MediaResult.data[0].entities[0].sentiment_score + MediaResult.data[1].entities[0].sentiment_score + MediaResult.data[2].entities[0].sentiment_score) / 3;
      console.log(average_sentiment);
      ticker.sentiment = average_sentiment;

      existingTicker.set({
        sentiment: ticker.sentiment,
        media_updatedAt: now // Update the timestamp
    });
    await existingTicker.save();
      }
    } else {
      console.log("A Serious DB Error Has Occured.")
    }
    
  }
  return tickers;
    
};

exports.fetchMediaData = async (tickers, position) => {
  try {
    const result = await getMediaSentiment(tickers);
    //console.log(result);
    return result;
  } catch (error) {
    console.error(error);
}

};

const constructFinanceQuery = async (symbol) => {
  const options = {
    method: 'GET',
    url: `https://yahoo-finance127.p.rapidapi.com/historic/${symbol}/1mo/1y`,
    headers: {
      'X-RapidAPI-Key': process.env.XRAPIDAPIKEY,
      'X-RapidAPI-Host': process.env.YAHOO_HOST
    }
  };
  
  try {
    const response = await axios.request(options);
    //console.log(response.data);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

const getStockData = async (tickers) => {
  //console.log(tickers);
  for (let ticker of tickers) {
      try {
        const existingTicker = await TickerModel.findOne({ symbol: ticker.symbol });
        if (existingTicker) {
          if (await checkFinanceData(existingTicker) == true) {
                  // If the ticker fields are not all -1 and the data is not older than 30 days,
                  // update the ticker object from the database
                  ticker.zero_day = existingTicker.zero_day;
                  ticker.one_mo = existingTicker.one_mo;
                  ticker.one_mo_perc = existingTicker.one_mo_perc;
                  ticker.three_mo = existingTicker.three_mo;
                  ticker.three_mo_perc = existingTicker.three_mo_perc;
                  ticker.one_y = existingTicker.one_y;
                  ticker.one_y_perc = existingTicker.one_y_perc;
                  
          }else{
            console.log("before Query");
            // Otherwise, fetch the financial data and update the database
            let data = await constructFinanceQuery(ticker.symbol);
            if (data && data.indicators && data.indicators.quote && data.indicators.quote[0]) {
                ticker.zero_day = data.indicators.quote[0].open[0];
                ticker.one_mo = data.indicators.quote[0].close[10];
                ticker.three_mo = data.indicators.quote[0].close[8];
                ticker.one_y = data.indicators.quote[0].close[11];
                ticker = computePercentages(ticker);
                
                // Update the ticker in the database
                existingTicker.set({
                    zero_day: ticker.zero_day,
                    one_mo: ticker.one_mo,
                    one_mo_perc: ticker.one_mo_perc,
                    three_mo: ticker.three_mo,
                    three_mo_perc: ticker.three_mo_perc,
                    one_y: ticker.one_y,
                    one_y_perc: ticker.one_y_perc,
                    updatedAt: now // Update the timestamp
                });
                await existingTicker.save();
            } else {
                console.warn("Unexpected data structure for ticker:", ticker.symbol, data);
            }
          }
          await delay(100);
        } 
    } catch (error) {
      console.error(`Error processing ticker`, error);
    }
  }
  //console.log(tickers);
  return tickers;
};

exports.fetchFinanceData = async (position, tickers) => {
  try {
    const result = await getStockData(tickers);
    //console.log(result);
    return result;
  } catch (error) {
    console.error(error);
}
  };