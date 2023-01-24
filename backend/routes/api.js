const express = require('express');
const homePageRouter = require('./homePage');
const projectRouter = require('./project');
const { authenticate } = require('../util/jwt');
const app = express();

//TODO add 'authenticate'
app.use('/homePage/', authenticate, homePageRouter);
app.use('/project/', authenticate, projectRouter);

module.exports = app;
