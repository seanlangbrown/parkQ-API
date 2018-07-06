const supertest = require('supertest');
const fs = require('fs');
const mockery = require('mockery');
const mockController = require('./mockController');
const spotQueueController = require('./spotQueueController.js');


describe ('API Endpoints', () => {

	
	beforeAll( async () => {

		//initialize new mockQueueController

		let mockController = new mockController(spotQueueController);

		mockery.enable({
			warnOnUnregistered: false
		});

		mockery.registerMock('./spotQueueController.js', mockController);
		let superAPI = supertest(spacesAPI);

		let spotOne = {};

	});

	afterAll( async () => {

		mockery.disable();
	});


	test('It should respond to the /spaces path with ___ when no spaces are available', async() => {
		mockController.setYield('assign', null); //?what to return if non available

		const availableSpace = await superAPI.get('/space');

		expect(availableSpace.statusCode).toBe(401); //error or not?

		expect(mockController.called.assign.count).toBe(1);

	});


	test('It should respond to posting to the /create path with success and create a space', async() => {

		mockController.setYield('create', () => ());

		const createdSpace = await superAPI.post('/create'); //how to post data?

		expect(requestedSpace.statusCode.toBe(201));

		expect(mockController.called.create.args[0]).toEqual([spotOne]);

	});

	test('It should respond to the /spaces path with the next available space', async () => {

		//put spotOne in spotQueueHandlerMock

		mockController.setYield('assign', spaceOne); //?what to return if non available

		const availableSpace = await superAPI.get('/space');

		expect(availableSpace.statusCode).toBe(200);

		expect(availableSpace.text.toEqual(spotOne));

	});



	test('It should respond to posting to the /spaces path with success and add a spot to the available queue', async () => {

		//add space 100 to mock queue as taken space

		mockController.setYield('release', () => (true));

		const postedSpace = await superAPI.post('/space/100');

		expect(postedSpace.statusCode).toBe(201);

		expect(mockController.called.release.args[0]).toBe([100]);
	});




	test('It should respond to posting to /spaces when the space ID does not exist with an error', async () => {

		mockController.setYield('release', () => (false));

		const postedSpace = await superAPI.post('/space/999');

		expect(postedSpace.statusCode).toBe(401); //or another error code

		expect(mockController.called.release.args[0]).toBe([999])


	});



	test('It should respond to posting to /fill path by taking a space', async () => {

		//create space 100, as assigned;

		mockController.setYield('take', () => (true));

		const postedSpace = await superAPI.post('/fill/100');

		expect(postedSpace.statusCode.toBe(201));

		expect(mockController.called.take.args[0]).toBe([100]);
	}


	test('It should respond to posting to /fill path when spot is already full by taking a space', async () => {

		//**this test may not be appropriate here** should controller handle already filled same as currently filled?**//

		mockController.setYield('take', () => (true));

		const postedSpace = await superAPI.psot('/fill/101');

		expect(postedSpace.statusCode.toBe(201));

		expect(mockController.called.take.args[0]).toBe([101]);
	}



});