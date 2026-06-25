const express = require('express');
const { getFarmers, getFarmer, createFarmer, updateFarmer, deleteFarmer, getStats } = require('../controllers/farmerController');
const { addLand, updateLand, deleteLand, addCrop, updateCrop, deleteCrop } = require('../controllers/landCropController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getFarmers).post(createFarmer);
router.route('/:id').get(getFarmer).put(updateFarmer).delete(deleteFarmer);

// Land sub-routes
router.post('/:farmerId/lands', addLand);
router.route('/lands/:id').put(updateLand).delete(deleteLand);

// Crop sub-routes
router.post('/:farmerId/crops', addCrop);
router.route('/crops/:id').put(updateCrop).delete(deleteCrop);

module.exports = router;
