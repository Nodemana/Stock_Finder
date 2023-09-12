const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/Routes');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);


//mongodb://127.0.0.1:27017/Stock_FinderDB
// Connect to MongoDB
mongoose.connect('mongodb://db:27017/Stock_FinderDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});