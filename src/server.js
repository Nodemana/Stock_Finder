const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/Routes');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});