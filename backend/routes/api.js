const express = require('express');
const homePageRouter = require('./homePage');
const projectRouter = require('./project');
// const { authenticate } = require('../middlewares/jwt');
const app = express();

app.use('/homePage/', homePageRouter);
app.use('/project/', projectRouter);

module.exports = app;
