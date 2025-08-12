const express = require('express');
const homePageRouter = require('./homePage');
const projectRouter = require('./project');
const searchRouter = require('./search'); 
const { authenticate } = require('../util/jwt');
const app = express();

//TODO add 'authenticate'
app.use('/homePage/', authenticate, homePageRouter);
app.use('/project/', authenticate, projectRouter);
app.use('/search/', authenticate, searchRouter); 

module.exports = app;