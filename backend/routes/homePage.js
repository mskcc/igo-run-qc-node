var express = require('express');
const homePageController = require('../controllers/HomePageController');
var router = express.Router();

router.get('/getSeqAnalysisProjects', homePageController.getSeqAnalysisProjects);
router.get('/getRequestProjects', homePageController.getRecentDeliveries);
router.get('/getRecentRuns', homePageController.getRecentRuns);
// router.get('/changeRunStatus', homePageController.changeRunStatus);
// router.get('/getCrosscheckMetrics', homePageController.getCrosscheckMetrics);
// router.get('/getInterOpsData', homePageController.getInterOpsData);
// router.get('/ngsStatsDownload', homePageController.ngsStatsDownload);
// router.get('/getCellRangerSample', homePageController.getCellRangerSample);

module.exports = router;
