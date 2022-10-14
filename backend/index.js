require('dotenv').config();

const path = require('path');
const express = require("express");

//routes
// const api = require('./routes/api');
// const getSeqAnalysisProjects = require('./routes/seqAnalysisProjects');

const PORT = process.env.PORT || 3001;
const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD,
};
const LIMS_URL = process.env.LIMS_URL;
const app = express();

// Have Node serve the files for our built frontend app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// app.use('/homeData/', seqAnalysisProjectsRouter);
// app.use('/project/, projectRouter);

// Handle GET requests to /getSeqAnalysisProjects route
// app.get("/api/getSeqAnalysisProjects", getSeqAnalysisProjects);

// // Handle GET requests to /recentRuns route
// app.get("/recentRuns", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});