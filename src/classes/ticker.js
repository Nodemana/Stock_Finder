const mongoose = require('mongoose');

class Ticker {
    constructor({symbol = "", zero_day = -1.0, one_mo = -1.0, one_mo_perc = -1.0, three_mo = -1.0, three_mo_perc = -1.0, one_y = -1.0, one_y_perc = -1.0, sentiment = "", industry = ""}) {
        this.symbol = symbol;
        this.zero_day = zero_day; //First Open Value
        this.one_mo = one_mo; //First Close Value
        this.one_mo_perc = one_mo_perc; //First Close Percentage
        this.three_mo = three_mo; // Three Month Close Value
        this.three_mo_perc = three_mo_perc; // Three Month Close Percentage
        this.one_y = one_y; // One Year Close Value
        this.one_y_perc = one_y_perc; // One Year Close Percentage
        this.sentiment = sentiment // Media Sentiment
        this.industry = industry;
    }
}

//MongoDB Model and Schema
const TickerSchema = new mongoose.Schema({
    symbol: { type: String, default: "" },
    zero_day: { type: Number, default: -1.0 },
    one_mo: { type: Number, default: -1.0 },
    one_mo_perc: { type: Number, default: -1.0 },
    three_mo: { type: Number, default: -1.0 },
    three_mo_perc: { type: Number, default: -1.0 },
    one_y: { type: Number, default: -1.0 },
    one_y_perc: { type: Number, default: -1.0 },
    sentiment: { type: String, default: "" },
    industry: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
    media_updatedAt: { type: Date, default: Date.now }
  });

const TickerModel = mongoose.model('Ticker', TickerSchema);

module.exports = {
    Ticker,
    TickerModel
};

