var express = require('express');
const homePageController = require('../controllers/HomePageController');
var router = express.Router();

router.get('/getSeqAnalysisProjects', homePageController.getSeqAnalysisProjects);
router.get('/getRequestProjects', homePageController.getRecentDeliveries);
router.get('/getRecentRuns', homePageController.getRecentRuns);
router.get('/getCrosscheckMetrics', homePageController.getCrosscheckMetrics);
router.get('/getInterOpsData', homePageController.getInterOpsData);
router.get('/ngsStatsDownload', homePageController.ngsStatsDownload);

module.exports = router;
