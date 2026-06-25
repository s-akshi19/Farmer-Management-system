const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerQuintal: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumPrice: { type: Number, min: 0 },
    maximumPrice: { type: Number, min: 0 },
    modalPrice: { type: Number, min: 0 },
    market: {
      type: String,
      trim: true,
      default: 'General Mandi',
    },
    state: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    unit: {
      type: String,
      default: 'Quintal',
    },
    source: {
      type: String,
      enum: ['Manual', 'API'],
      default: 'Manual',
    },
  },
  { timestamps: true }
);

marketPriceSchema.index({ cropName: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
