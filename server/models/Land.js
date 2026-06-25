const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    khasraNumber: {
      type: String,
      required: [true, 'Khasra number is required'],
      trim: true,
    },
    areaAcres: {
      type: Number,
      required: [true, 'Land area is required'],
      min: 0,
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Arid', 'Forest', 'Other'],
      default: 'Alluvial',
    },
    irrigationType: {
      type: String,
      enum: ['Canal', 'Borewell', 'Rainfed', 'Drip', 'Sprinkler', 'Other'],
      default: 'Rainfed',
    },
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    ownershipType: {
      type: String,
      enum: ['Owned', 'Leased', 'Shared'],
      default: 'Owned',
    },
    currentCrop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Land', landSchema);
