const express = require('express');
const _ = require('lodash');
const path = require('path');
const spotQ = require('./spotQueueHandler.js');
const app = express();
const PORT = process.env.PORT || '3000';



app.get('/status', (req, res) => (res.send('running at: ' + PORT)));

app.use('/space', spotQ);

app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('server listening to port', PORT);
	}
});

console.log('running');