const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174', credentials: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Farmer Management API running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));

process.on('unhandledRejection', (err) => console.error(`Unhandled Rejection: ${err.message}`));
