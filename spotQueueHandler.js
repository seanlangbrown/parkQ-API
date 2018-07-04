const express = require('express');
const _ = require('lodash');
const path = require('path');


const spotHandler = express.Router();



spotHandler.get('/', (req, res) => (res.send({id: 1, type: 1, time: 0})));




module.exports = spotHandler;