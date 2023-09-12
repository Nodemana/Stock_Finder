const express = require('express');
const router = express.Router();
const { performApiMashup } = require('../controllers/apiController');
const { incrementVisitCount } = require('../controllers/visitCount');

router.get('/visitCount', incrementVisitCount, (req, res) => {
    res.json({ count: req.incrementVisitCount });
});

router.post('/findstocks', performApiMashup);

module.exports = router;