const express = require('express');
const router = express.Router();
const { performApiMashup } = require('../controllers/apiController');

router.post('/findstocks', performApiMashup);

module.exports = router;