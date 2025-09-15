require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); 


mongoose.connect(process.env.MONGODB_URL_LOGIN);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
const apiRouter = require('./routes/api');


const port = process.env.PORT || 3001;
const hostname = '127.0.0.1';

var publicDir = path.join(__dirname, 'public');

const app = express();

app.use(cookieParser());
const jwtInCookie = require('jwt-in-cookie');
jwtInCookie.configure({ secret: process.env.JWT_SECRET });

const corsConfig = {
    origin: true,
    credentials: true,
};

// To allow cross-origin requests
app.use(cors(corsConfig));

// Have Node serve the files for our built frontend app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Handle GET requests to /api route
// app.get("/api", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });
app.use('/api/', apiRouter);

// All other GET requests not handled before will return our React app
app.use('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = server;