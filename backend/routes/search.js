var express = require('express');
const searchController = require('../controllers/SearchController');
var router = express.Router();

router.get('/searchQc', searchController.searchQc);

module.exports = router;