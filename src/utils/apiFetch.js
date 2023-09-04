const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();


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
    const cacheKey = `${category}_${lookbackPeriod}`;
    
    if (cache[cacheKey]) {
        return cache[cacheKey];
      }

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
        const count = totalResults['_']; // Here is where you extract the '4497'
        console.log(`Total Results for ${category}:`, count);
        cache[cacheKey] = parseInt(count, 10);
        resolve(parseInt(count, 10));
      } else {
        console.log(`No total results for ${category}`);
        resolve(0);
      }
    });
  });
};
  
  
    // Query Delay Time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      
          // Wait for 3.5 seconds before the next API call
          await delay(3500);
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

const getPositiveSentimentMedia = async (industry, lookbackPeriod) => {
    const apiUrl = `https://api.marketaux.com/v1/news/all?sentiment_gte=0.1&industries=${industry}&filter_entities=true&language=en&api_token=${process.env.MARKETAUX_API_KEY}`

};

exports.fetchMediaData = async (position, lookbackPeriod) => {


};

exports.fetchFinanceData = async (position, lookbackPeriod) => {
    // Make API calls and process data here
    // Return the processed data
  };