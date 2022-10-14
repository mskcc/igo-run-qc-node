require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require("express");
const apiRouter = require('./routes/api');


const port = process.env.PORT || 3001;
const hostname = '127.0.0.1';

const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD,
};
const LIMS_URL = process.env.LIMS_URL;
const app = express();

const corsConfig = {
    origin: true,
    credentials: true,
};

//To allow cross-origin requests
// app.use(cors(corsConfig));

// Have Node serve the files for our built frontend app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Handle GET requests to /api route
// app.get("/api", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });
app.use('/api/', apiRouter);

// All other GET requests not handled before will return our React app
app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = server;
