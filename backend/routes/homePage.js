var express = require('express');
const homePageController = require('../controllers/HomePageController');
// const projectController = require('../controllers/projectController');
var router = express.Router();

router.get('/getSeqAnalysisProjects', homePageController.getSeqAnalysisProjects);
// router.get('/getRequestProjects', homePageController.getRequestProjects);
// router.get('/getRecentRuns', homePageController.getRecentRuns);
// router.get('/changeRunStatus', homePageController.changeRunStatus);
// router.get('/getCrosscheckMetrics', homePageController.getCrosscheckMetrics);
// router.get('/getInterOpsData', homePageController.getInterOpsData);
// router.get('/ngsStatsDownload', homePageController.ngsStatsDownload);
// router.get('/getCellRangerSample', homePageController.getCellRangerSample);
// router.get('/submitFeedback', homePageController.submitFeedback);
// router.get('/getFeedback', homePageController.getFeedback);
// router.get('/projects', projectController);

module.exports = router;