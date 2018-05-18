const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socketEventHanddler = require('./socket');
io.on('connection', socketEventHanddler);
http.listen(PORT);
