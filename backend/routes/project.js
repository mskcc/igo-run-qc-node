var express = require('express');
const projectController = require('../controllers/ProjectController');
var router = express.Router();

router.get('/:projectId', projectController.renderProjectPage); // do we want to set this up differently?
router.get('/getProjectQc/:projectId', projectController.getProjectQc);
router.get('/projectInfo/:projectId', projectController.projectInfo);
router.get('/addComment', projectController.addComment);
router.get('/getComments/:projectId', projectController.getComments);


module.exports = router;