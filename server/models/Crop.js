const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    land: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Land',
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    cropType: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'],
      required: true,
    },
    variety: { type: String, trim: true },
    sowingDate: { type: Date },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    areaAcres: { type: Number, min: 0 },
    expectedYieldKg: { type: Number, min: 0 },
    actualYieldKg: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['Sowing', 'Growing', 'Harvested', 'Failed'],
      default: 'Sowing',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
