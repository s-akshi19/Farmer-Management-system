const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    aadhaarNumber: {
      type: String,
      trim: true,
    },
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    totalLandAcres: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-generate farmer ID like FM-0001
farmerSchema.pre('save', async function (next) {
  if (!this.farmerId) {
    const count = await mongoose.model('Farmer').countDocuments();
    this.farmerId = `FM-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

farmerSchema.index({ name: 'text', village: 'text', district: 'text' });

module.exports = mongoose.model('Farmer', farmerSchema);
