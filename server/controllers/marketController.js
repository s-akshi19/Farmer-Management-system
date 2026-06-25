const asyncHandler = require('express-async-handler');
const MarketPrice = require('../models/MarketPrice');

// Mock market data for major Indian crops (simulates live API)
const mockMarketData = [
  { cropName: 'Wheat', pricePerQuintal: 2275, minimumPrice: 2100, maximumPrice: 2400, modalPrice: 2275, market: 'Hapur Mandi', state: 'Uttar Pradesh' },
  { cropName: 'Rice', pricePerQuintal: 2183, minimumPrice: 2000, maximumPrice: 2350, modalPrice: 2183, market: 'Lucknow Mandi', state: 'Uttar Pradesh' },
  { cropName: 'Sugarcane', pricePerQuintal: 315, minimumPrice: 290, maximumPrice: 340, modalPrice: 315, market: 'Meerut Mandi', state: 'Uttar Pradesh' },
  { cropName: 'Mustard', pricePerQuintal: 5450, minimumPrice: 5100, maximumPrice: 5800, modalPrice: 5450, market: 'Agra Mandi', state: 'Uttar Pradesh' },
  { cropName: 'Potato', pricePerQuintal: 1200, minimumPrice: 900, maximumPrice: 1500, modalPrice: 1200, market: 'Kanpur Mandi', state: 'Uttar Pradesh' },
  { cropName: 'Onion', pricePerQuintal: 1800, minimumPrice: 1500, maximumPrice: 2200, modalPrice: 1800, market: 'Nashik Mandi', state: 'Maharashtra' },
  { cropName: 'Tomato', pricePerQuintal: 2500, minimumPrice: 1800, maximumPrice: 3200, modalPrice: 2500, market: 'Pune Mandi', state: 'Maharashtra' },
  { cropName: 'Cotton', pricePerQuintal: 6600, minimumPrice: 6300, maximumPrice: 6900, modalPrice: 6600, market: 'Nagpur Mandi', state: 'Maharashtra' },
  { cropName: 'Soybean', pricePerQuintal: 4300, minimumPrice: 4000, maximumPrice: 4600, modalPrice: 4300, market: 'Indore Mandi', state: 'Madhya Pradesh' },
  { cropName: 'Maize', pricePerQuintal: 1900, minimumPrice: 1700, maximumPrice: 2100, modalPrice: 1900, market: 'Hyderabad Mandi', state: 'Telangana' },
  { cropName: 'Groundnut', pricePerQuintal: 5800, minimumPrice: 5400, maximumPrice: 6200, modalPrice: 5800, market: 'Rajkot Mandi', state: 'Gujarat' },
  { cropName: 'Gram (Chana)', pricePerQuintal: 5440, minimumPrice: 5100, maximumPrice: 5800, modalPrice: 5440, market: 'Jaipur Mandi', state: 'Rajasthan' },
];

// GET all market prices (from DB + live mock)
exports.getMarketPrices = asyncHandler(async (req, res) => {
  const { cropName, state } = req.query;
  const query = {};
  if (cropName) query.cropName = new RegExp(cropName, 'i');
  if (state) query.state = new RegExp(state, 'i');

  const dbPrices = await MarketPrice.find(query).sort({ date: -1 }).limit(50);

  // Merge mock live data with slight random fluctuation to simulate real API
  const livePrices = mockMarketData
    .filter(m => !cropName || m.cropName.toLowerCase().includes(cropName.toLowerCase()))
    .map(m => ({
      ...m,
      pricePerQuintal: m.pricePerQuintal + Math.floor(Math.random() * 100 - 50),
      date: new Date(),
      source: 'API',
      _id: `live_${m.cropName}`,
    }));

  res.json({ success: true, livePrices, savedPrices: dbPrices });
});

// POST add/update market price manually
exports.addMarketPrice = asyncHandler(async (req, res) => {
  const price = await MarketPrice.create({ ...req.body, source: 'Manual' });
  res.status(201).json({ success: true, price });
});

// DELETE market price
exports.deleteMarketPrice = asyncHandler(async (req, res) => {
  const price = await MarketPrice.findById(req.params.id);
  if (!price) { res.status(404); throw new Error('Price record not found'); }
  await price.deleteOne();
  res.json({ success: true, message: 'Price record deleted' });
});
