const express = require('express');
//const _ = require('lodash');
const path = require('path');
const bodyParser = require('body-parser');
const spotQueue = require('./spotQueueController.js');


const spotHandler = express.Router();


spotHandler.get('/', async (req, res) => {
  //validate input
  let invalid = false;
  if (invalid) {
    res.status(401);
    res.end('invalid input');
    return;
  }
	let assignedSpot = await spotQueue.assign();
  if (assignedSpot === null) {
    res.status(501);
    res.end('server error: could not assign spot');
    return;
  }
  res.status(200);
  res.json(assignedSpot);
});


spotHandler.get('/all', (req, res) => {
	let emptySpots = spotQueue.view();
	res.json(emptySpots);
});


spotHandler.post('/release/:id', bodyParser.urlencoded({extened: true}), async (req, res) => {
	//console.log(req.params);
	let success = await spotQueue.release(req.params.id);
  //console.log('rel success', success);
  if (!success) {
    let isSpace = await spotQueue.isSpace(req.params.id);
    if (!isSpace) {
      res.status(401);
      res.end('invalid space id');
      return;
    }
    res.status(501);
    res.end('server error: could not release space');
    return;
  }
	res.status(201);
	res.end('space released');
});

spotHandler.post('/create', bodyParser.urlencoded({extened: true}), async (req, res) => {
  //validate input
  let invalid = false;
  if (invalid) {
    res.status(401);
    res.end('invalid input');
    return;
  }
  let success = await spotQueue.create({});
  if (!success) {
    res.status(501);
    res.end('server error: could not create space');
    return;
  }
  res.status(201);
  res.end('created new space');

});

spotHandler.post('/take/:id', async (req, res) => {
  let success = await spotQueue.take(req.params.id);
  if (!success) {
    res.status(501);
    res.end('server error: space unavailable');
    return;
  }
  res.status(201);
  res.end('reserved space');
});




module.exports = spotHandler;