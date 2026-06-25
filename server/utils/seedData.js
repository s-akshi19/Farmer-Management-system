const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Land = require('../models/Land');
const Crop = require('../models/Crop');
const MarketPrice = require('../models/MarketPrice');

const villages = ['Rampur', 'Shivpur', 'Krishnanagar', 'Sundarpur', 'Govindpur', 'Nandgaon', 'Brijpur', 'Radhakund', 'Mathurapur', 'Vrindavan'];
const districts = ['Meerut', 'Ghaziabad', 'Agra', 'Lucknow', 'Kanpur', 'Varanasi', 'Allahabad', 'Mathura', 'Aligarh', 'Bareilly'];
const crops = ['Wheat', 'Rice', 'Sugarcane', 'Mustard', 'Potato', 'Onion', 'Maize', 'Gram'];
const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite'];
const irrigationTypes = ['Canal', 'Borewell', 'Rainfed', 'Drip'];
const cropTypes = ['Kharif', 'Rabi', 'Zaid', 'Perennial'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Farmer.deleteMany(), Land.deleteMany(), Crop.deleteMany(), MarketPrice.deleteMany()]);

  console.log('Creating admin user...');
  await User.create({
    name: 'Sakshi Tripathi',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    district: 'Ghaziabad',
  });
  await User.create({
    name: 'Demo Officer',
    email: 'officer@demo.com',
    password: 'password123',
    role: 'officer',
    district: 'Meerut',
  });

  console.log('Creating 100 farmer records...');
  const farmers = [];
  for (let i = 0; i < 100; i++) {
    const district = rand(districts);
    const village = rand(villages);
    farmers.push({
      name: `Farmer ${i + 1} ${rand(['Kumar', 'Singh', 'Yadav', 'Verma', 'Sharma', 'Patel', 'Gupta', 'Tiwari'])}`,
      phone: `9${randNum(100000000, 999999999)}`,
      village,
      district,
      state: 'Uttar Pradesh',
      totalLandAcres: randNum(1, 20),
      status: Math.random() > 0.1 ? 'active' : 'inactive',
    });
  }
  const createdFarmers = await Farmer.insertMany(farmers);

  console.log('Creating land and crop records...');
  const lands = [];
  const cropRecords = [];
  for (const farmer of createdFarmers) {
    const numLands = randNum(1, 3);
    for (let j = 0; j < numLands; j++) {
      lands.push({
        farmer: farmer._id,
        khasraNumber: `KH-${randNum(1000, 9999)}`,
        areaAcres: randNum(1, 8),
        soilType: rand(soilTypes),
        irrigationType: rand(irrigationTypes),
        village: farmer.village,
        district: farmer.district,
        state: farmer.state,
        ownershipType: rand(['Owned', 'Leased', 'Shared']),
      });
      cropRecords.push({
        farmer: farmer._id,
        cropName: rand(crops),
        cropType: rand(cropTypes),
        sowingDate: new Date(Date.now() - randNum(30, 120) * 24 * 60 * 60 * 1000),
        expectedHarvestDate: new Date(Date.now() + randNum(30, 180) * 24 * 60 * 60 * 1000),
        areaAcres: randNum(1, 5),
        expectedYieldKg: randNum(500, 5000),
        status: rand(['Sowing', 'Growing', 'Harvested']),
      });
    }
  }
  await Land.insertMany(lands);
  await Crop.insertMany(cropRecords);

  console.log('Adding market prices...');
  await MarketPrice.insertMany([
    { cropName: 'Wheat', pricePerQuintal: 2275, market: 'Hapur Mandi', state: 'Uttar Pradesh', source: 'Manual' },
    { cropName: 'Rice', pricePerQuintal: 2183, market: 'Lucknow Mandi', state: 'Uttar Pradesh', source: 'Manual' },
    { cropName: 'Potato', pricePerQuintal: 1200, market: 'Agra Mandi', state: 'Uttar Pradesh', source: 'Manual' },
    { cropName: 'Mustard', pricePerQuintal: 5450, market: 'Mathura Mandi', state: 'Uttar Pradesh', source: 'Manual' },
  ]);

  console.log('\n✅ Seeded successfully!');
  console.log(`   100 farmers | ${lands.length} land records | ${cropRecords.length} crop records`);
  console.log('\nDemo logins:');
  console.log('  Admin   → admin@demo.com / password123');
  console.log('  Officer → officer@demo.com / password123');
  process.exit();
};

seed().catch((err) => { console.error(err); process.exit(1); });
