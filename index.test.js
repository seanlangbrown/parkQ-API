const supertest = require('supertest');
const fs = require('fs');
//const mocked = await require('./mockController');
const spotQueueController = require('./spotQueueController.js');
const spacesAPI = require('./indexApp.js');


describe ('API Endpoints', () => {

	let mockController;

	let superAPI;

	let spotOne;

	let app;
	
	beforeEach( async () => {

		//initialize new mockQueueController
		//app = spacesAPI.listen()
		
		superAPI = await supertest.agent(spacesAPI.listen());

		spotOne = {};

	});

	afterEach( async () => {
	});


	test('It should respond to the /spaces path with status 200 and id:null when no spaces are available', async () => {
		//mockController.setYield('assign', {id: null}); //?what to return if non available
		spotQueueController.assign = jest.spyOn(spotQueueController, 'assign');
		spotQueueController.assign.mockImplementation(() => ({id: null}));

		let availableSpace = await superAPI.get('/space');

		expect(availableSpace.statusCode).toBe(200); //error or not?

		expect(spotQueueController.assign).toHaveBeenCalled();

	});


	test('It should respond to posting to the /create path with success and create a space', async() => {

		//mockController.setYield('create', true);
		spotQueueController.create = jest.spyOn(spotQueueController, 'create');
		spotQueueController.create.mockImplementation(() => (true));

		let createdSpace = await superAPI.post('/space/create'); //how to post data?

		expect(createdSpace.statusCode).toBe(201);

		expect(spotQueueController.create).toHaveBeenCalledWith(spotOne);

	});

	test('It should respond to the /spaces path with the next available space', async () => {

		//put spotOne in spotQueueHandlerMock

		//mockController.setYield('assign', spotOne); //?what to return if non available
		spotQueueController.assign = jest.spyOn(spotQueueController, 'assign');
		spotQueueController.assign.mockImplementation(() => (spotOne));

		let availableSpace = await superAPI.get('/space');

		expect(availableSpace.statusCode).toBe(200);

		expect(availableSpace.text).toEqual(JSON.stringify(spotOne));

	});



	test('It should respond to posting to the /spaces path with success and add a spot to the available queue', async () => {

		//add space 100 to mock queue as taken space
		spotQueueController.release = jest.spyOn(spotQueueController, 'release');
		spotQueueController.release.mockImplementation(() => (true));

		let postedSpace = await superAPI.post('/space/release/100');

		expect(postedSpace.statusCode).toBe(201);

		expect(spotQueueController.release).toHaveBeenCalledWith('100');
	});

	test('It should respond to posting to /spaces/release when the space ID does not exist with an error', async () => {

		spotQueueController.release = jest.spyOn(spotQueueController, 'release');
		spotQueueController.release.mockImplementation(() => (false));

		spotQueueController.isSpace = jest.spyOn(spotQueueController, 'isSpace');
		spotQueueController.isSpace.mockImplementation(() => (false));

		let postedSpace = await superAPI.post('/space/release/999');

		expect(postedSpace.statusCode).toBe(401); //or another error code

		expect(spotQueueController.release).toHaveBeenCalledWith('999');

	});


	test('It should respond to posting to /take path by taking a space', async () => {

		//create space 100, as assigned;

		spotQueueController.take = jest.spyOn(spotQueueController, 'take');
		spotQueueController.take.mockImplementation(() => (true));

		let postedSpace = await superAPI.post('/space/take/100');

		expect(postedSpace.statusCode).toBe(201);

		expect(spotQueueController.take).toHaveBeenCalledWith('100');
	});


});