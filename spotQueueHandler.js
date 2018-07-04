const express = require('express');
const _ = require('lodash');
const path = require('path');
const bodyParser = require('body-parser');
const spotQueue = require('./spotQueueController.js');


const spotHandler = express.Router();


spotHandler.get('/', (req, res) => {
	let assignedSpot = spotQueue.assign();
	res.json(assignedSpot);
});


spotHandler.get('/all', (req, res) => {
	let emptySpots = spotQueue.view();
	res.json(emptySpots);
});


spotHandler.post('/', bodyParser.urlencoded({extened: true}), (req, res) => {
	console.log(req.body);
	spotQueue.release(req.body.id);
	res.status(201);
	res.end();

});




module.exports = spotHandler;