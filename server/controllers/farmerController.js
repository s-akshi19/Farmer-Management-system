const asyncHandler = require('express-async-handler');
const Farmer = require('../models/Farmer');
const Land = require('../models/Land');
const Crop = require('../models/Crop');

// GET all farmers with search/filter/pagination
exports.getFarmers = asyncHandler(async (req, res) => {
  const { search, district, state, status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (district) query.district = new RegExp(district, 'i');
  if (state) query.state = new RegExp(state, 'i');
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [farmers, total] = await Promise.all([
    Farmer.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Farmer.countDocuments(query),
  ]);
  res.json({ success: true, count: farmers.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), farmers });
});

// GET single farmer with all their land and crops
exports.getFarmer = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.id);
  if (!farmer) { res.status(404); throw new Error('Farmer not found'); }
  const [lands, crops] = await Promise.all([
    Land.find({ farmer: farmer._id }),
    Crop.find({ farmer: farmer._id }).sort({ createdAt: -1 }),
  ]);
  res.json({ success: true, farmer, lands, crops });
});

// POST create farmer
exports.createFarmer = asyncHandler(async (req, res) => {
  req.body.addedBy = req.user.id;
  const farmer = await Farmer.create(req.body);
  res.status(201).json({ success: true, farmer });
});

// PUT update farmer
exports.updateFarmer = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!farmer) { res.status(404); throw new Error('Farmer not found'); }
  res.json({ success: true, farmer });
});

// DELETE farmer
exports.deleteFarmer = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.params.id);
  if (!farmer) { res.status(404); throw new Error('Farmer not found'); }
  await Promise.all([
    Land.deleteMany({ farmer: farmer._id }),
    Crop.deleteMany({ farmer: farmer._id }),
    farmer.deleteOne(),
  ]);
  res.json({ success: true, message: 'Farmer and all related records deleted' });
});

// GET dashboard stats
exports.getStats = asyncHandler(async (req, res) => {
  const [totalFarmers, activeFarmers, totalLands, totalCrops] = await Promise.all([
    Farmer.countDocuments(),
    Farmer.countDocuments({ status: 'active' }),
    Land.countDocuments(),
    Crop.countDocuments(),
  ]);
  const landAgg = await Land.aggregate([{ $group: { _id: null, totalAcres: { $sum: '$areaAcres' } } }]);
  const cropStatusAgg = await Crop.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const districtAgg = await Farmer.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]);

  res.json({
    success: true,
    stats: {
      totalFarmers,
      activeFarmers,
      inactiveFarmers: totalFarmers - activeFarmers,
      totalLandParcels: totalLands,
      totalAcres: landAgg[0]?.totalAcres || 0,
      totalCrops,
      cropsByStatus: cropStatusAgg,
      topDistricts: districtAgg,
    },
  });
});
