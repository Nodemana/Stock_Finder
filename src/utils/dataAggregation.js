exports.computePercentages = (ticker) => {
    ticker.one_mo_perc = ((ticker.one_y - ticker.one_mo)/ticker.one_mo) * 100;
    ticker.three_mo_perc = ((ticker.one_y - ticker.three_mo)/ticker.three_mo) * 100;
    ticker.one_y_perc = ((ticker.one_y - ticker.zero_day)/ticker.zero_day) * 100;
    return ticker;
};

exports.determineValuableTickers = (tickers, position) => {
    let valuableTicker = [];
    console.log(position);
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