exports.computePercentages = (ticker) => {
    ticker.one_mo_perc = ((ticker.one_y - ticker.one_mo)/ticker.one_mo) * 100;
    ticker.three_mo_perc = ((ticker.one_y - ticker.three_mo)/ticker.three_mo) * 100;
    ticker.one_y_perc = ((ticker.one_y - ticker.zero_day)/ticker.zero_day) * 100;
    return ticker;
};

exports.determineValuableTickers = (tickers, position) => {
    let valuableTicker = [];
    if (position === "longlongterm") {
        valuableTicker = tickers.sort((a, b) => {
            return (a.one_y_perc + a.three_mo_perc) - (b.one_y_perc + b.three_mo_perc);
        });
    } else if (position === "longshortterm") {
        valuableTicker = tickers.sort((a, b) => {
            return (a.one_mo_perc + a.three_mo_perc) - (b.one_mo_perc + b.three_mo_perc);
        });
    } else if (position === "short") {
        valuableTicker = tickers.sort((a, b) => {
            return (b.one_mo_perc + b.three_mo_perc) - (a.one_mo_perc + a.three_mo_perc);
        });
    }
    return valuableTicker;
};

exports.determineBestBuys = (tickers, position) => {
    let bestBuys = [];
    
    if (position === "longlongterm") {
        let threshold = 0;
        while (bestBuys.length < 5 && threshold >= -1) {
            bestBuys = tickers
                .filter(ticker => ticker.sentiment > threshold)
                .sort((a, b) => b.sentiment - a.sentiment)  
                .slice(0, 5);  
            threshold -= 0.05;  // Decrement the threshold in small steps, you can adjust this value
        }
    } 
    else if (position === "longshortterm") {
        let threshold = 0.15;
        while (bestBuys.length < 5 && threshold >= 0) {
            bestBuys = tickers
                .filter(ticker => ticker.sentiment > threshold)
                .sort((a, b) => b.sentiment - a.sentiment)  
                .slice(0, 5);
            threshold -= 0.05;  // Decrement the threshold in small steps
        }
    } 
    else if (position === "short") {
        let threshold = 0;
        while (bestBuys.length < 5 && threshold <= 1) {
            bestBuys = tickers
                .filter(ticker => ticker.sentiment < threshold)
                .sort((a, b) => a.sentiment - b.sentiment)  
                .slice(0, 5); 
            threshold += 0.05;  // Increment the threshold in small steps for shorts
        }
    }
    
    return bestBuys;
};