const express = require('express');
//const _ = require('lodash');
const path = require('path');
const spotQ = require('./spotQueueHandler.js');


const app = express();

app.get('/status', (req, res) => (res.send('running at: ' + PORT)));

app.use('/space', spotQ);

module.exports = app;