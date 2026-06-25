const express = require('express');
const { getMarketPrices, addMarketPrice, deleteMarketPrice } = require('../controllers/marketController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.route('/').get(getMarketPrices).post(addMarketPrice);
router.delete('/:id', deleteMarketPrice);
module.exports = router;
