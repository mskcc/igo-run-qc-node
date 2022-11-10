var express = require('express');
const projectController = require('../controllers/ProjectController');
var router = express.Router();

router.get('/getProjectQc/:projectId', projectController.projectQc);
// router.get('/changeRunStatus', homePageController.changeRunStatus);
// router.get('/addComment', projectController.addComment);
// router.get('/getComments/:projectId', projectController.getComments);


module.exports = router;