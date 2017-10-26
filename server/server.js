const express = require('express');
const path = require('path');
const http = require('http');

//let jwt = require('jsonwebtoken');

// API routes
const proxy_router = require('./proxy.js');

const app = express();


// Allowing CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(proxy_router);


//Get port from environment and store in Express.
const port = process.env.PORT || '7788';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on this port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));