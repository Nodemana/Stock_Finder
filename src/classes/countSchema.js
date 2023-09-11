const mongoose = require('mongoose');

//MongoDB Model and Schema
const VisitCountSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  });

const VisitCountModel = mongoose.model('VisitCount', VisitCountSchema);


//MongoDB Model and Schema
const PaperCountSchema = new mongoose.Schema({
    industry: { type: String, default: "" },
    count: { type: Number, default: -1.0 },
    lookback_period: {type: Number, default: 0},
    updatedAt: { type: Date, default: Date.now },
  });

const PaperCountModel = mongoose.model('PaperCount', PaperCountSchema);

module.exports = {
    PaperCountModel,
    VisitCountModel
};