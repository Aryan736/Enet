const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
console.log(process.env.MONGO_URI);

dotenv.config();

// Connect to MongoDB
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ADD THIS
app.use(express.static(path.join(__dirname, 'frontend',)));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));

// Base route
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'frontend', 'register.html'));
});

const PORT = process.env.PORT || 5550;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});