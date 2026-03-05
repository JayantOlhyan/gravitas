require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 5000 : 100, // max 5000 requests per 15 mins locally
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Basic health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'GRAVITAS API is operational', timestamp: new Date() });
});

// Import Routes
const debrisRoutes = require('./routes/debris');
const neoRoutes = require('./routes/neo');
const weatherRoutes = require('./routes/weather');
const riskRoutes = require('./routes/risk');

app.use('/api/debris', debrisRoutes);
app.use('/api/neo', neoRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/risk', riskRoutes);

// Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`GRAVITAS API Server running on port ${PORT}`);
});
