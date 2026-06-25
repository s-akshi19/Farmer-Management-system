const asyncHandler = require('express-async-handler');
const Land = require('../models/Land');
const Crop = require('../models/Crop');
const Farmer = require('../models/Farmer');

// ─── LAND ────────────────────────────────────────────────

exports.addLand = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.farmerId);
  if (!farmer) { res.status(404); throw new Error('Farmer not found'); }
  req.body.farmer = farmer._id;
  const land = await Land.create(req.body);
  // Update farmer's total land
  const agg = await Land.aggregate([{ $match: { farmer: farmer._id } }, { $group: { _id: null, total: { $sum: '$areaAcres' } } }]);
  await Farmer.findByIdAndUpdate(farmer._id, { totalLandAcres: agg[0]?.total || 0 });
  res.status(201).json({ success: true, land });
});

exports.updateLand = asyncHandler(async (req, res) => {
  const land = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!land) { res.status(404); throw new Error('Land record not found'); }
  res.json({ success: true, land });
});

exports.deleteLand = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);
  if (!land) { res.status(404); throw new Error('Land not found'); }
  await land.deleteOne();
  const agg = await Land.aggregate([{ $match: { farmer: land.farmer } }, { $group: { _id: null, total: { $sum: '$areaAcres' } } }]);
  await Farmer.findByIdAndUpdate(land.farmer, { totalLandAcres: agg[0]?.total || 0 });
  res.json({ success: true, message: 'Land record deleted' });
});

// ─── CROP ────────────────────────────────────────────────

exports.addCrop = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.farmerId);
  if (!farmer) { res.status(404); throw new Error('Farmer not found'); }
  req.body.farmer = farmer._id;
  const crop = await Crop.create(req.body);
  res.status(201).json({ success: true, crop });
});

exports.updateCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!crop) { res.status(404); throw new Error('Crop not found'); }
  res.json({ success: true, crop });
});

exports.deleteCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) { res.status(404); throw new Error('Crop not found'); }
  await crop.deleteOne();
  res.json({ success: true, message: 'Crop deleted' });
});
