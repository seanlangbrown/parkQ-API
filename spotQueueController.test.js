const _ = require('underscore');
const controller = require('./spotQueueController.js');

describe ('Queue Controller', () => {

	let spotOne = {name: 'spotOne'};
	let spotTwo = {name: 'spotTwo'};
	let spotThree = {name: 'spotThree'};

	
	beforeEach( async () => {
		let connected = await controller.connect();
		//initialize 

	});

	afterEach( async () => {
		let disconnected = await controller.disconnect();
	});


	test('It should create spaces', async () => {

		let created = await controller.create({});
		let isSpace = await controller.isSpace(created.id);

		expect(created.success).toEqual(true); //check syntax
		////console.log(await controller.view());
		expect(isSpace).toBe(true);

	});


	/*
	test('It should count all spaces in the system', async () => {
		let createOne = controller.create({});
		let createTwo = controller.create({});
		let createThree = controller.create({});


	});
	*/



	test('It should count the number of available spaces', async () => {
		let createOne = await controller.create({});
		let createTwo = await controller.create({});
		let createThree = await controller.create({});

		let availableSpacesCount = await controller.count();

		expect(availableSpacesCount).toBe(3);

	});



	test('It should return all available spaces', async () => {
		let createOne = await controller.create(spotOne);
		let createTwo = await controller.create(spotTwo);
		let createThree = await controller.create(spotThree);

		let availableSpaces = await controller.view();
		//console.log('available 65', availableSpaces);
		expect(availableSpaces[0].attributes.name).toEqual(spotOne.name);

	});



	test('It should assign spaces', async () => {

		let created = await controller.create(spotOne);
		let assigned = await controller.assign();
		//console.log('assigned 74', assigned);
		expect(assigned.attributes.name).toEqual(spotOne.name);

	});

	test('It should remove assigned spaces from the queue', async () => {
		let created = await controller.create(spotOne);
		let assigned = await controller.assign();
		let availableSpaces = await controller.view();

		availableSpaces.forEach((space) => {
			expect(space.attributes.name).not.toEqual(spotOne.name);
		});
		
	});


	test('It should assign spaces in the order released', async () => {

		//console.log(spotOne.name, spotOne);
		let createdOne = await controller.create(spotOne);
		//console.log(spotTwo.name, spotTwo);
		let createTwo = await controller.create(spotTwo);
		//console.log(spotThree.name, spotThree);
		let createThree = await controller.create(spotThree);

		//console.log('availableSpaces 98', await controller.view());
		let assignedFirst = await controller.assign();
		//console.log('availableSpaces 101', await controller.view());
		let assignedSecond = await controller.assign();
		//console.log('availableSpaces 104', await controller.view());
		let assignedThird = await controller.assign();

		//console.log('availableSpaces 106', await controller.view());

		expect(assignedFirst.attributes.name).toBe(spotOne.name);
		expect(assignedSecond.attributes.name).toBe(spotTwo.name);
		expect(assignedThird.attributes.name).toBe(spotThree.name);

		let releasedFirst = await controller.release(assignedThird.id);
		let releasedSecond = await controller.release(assignedSecond.id);
		let releasedThird = await controller.release(assignedFirst.id);
	
		let assignedFourth = await controller.assign();
		let assignedFifth = await controller.assign();
		let assignedSixth = await controller.assign();

		expect(assignedFourth.attributes.name).toEqual(spotThree.name);
		expect(assignedFourth.id).toEqual(assignedThird.id);
		expect(assignedFifth.attributes.name).toEqual(spotTwo.name);
		expect(assignedFifth.id).toEqual(assignedSecond.id);
		expect(assignedSixth.attributes.name).toEqual(spotOne.name);
		expect(assignedSixth.id).toEqual(assignedFirst.id);
		

	});


	test('It should release spaces and add them to the assignment queue', async () => {
		let created = await controller.create(spotOne);
		let assigned = await controller.assign();
		let filled = await controller.take(assigned.id);
		let realeased = await controller.release(assigned.id);
		let availableSpaces = await controller.view();

		let foundSpace = _.any(availableSpaces, (space) => (space.attributes.name ===spotOne.name));
		expect(foundSpace).toEqual(true);

	});


	/*
	test('It should release spaces if not filled by timeout and return them to the assignment queue', async () => {


	});
	*/



	test('It should fill assigned spaces', async () => {

		let created = await controller.create(spotOne);
		let assigned = await controller.assign();
		let filled = await controller.take(assigned.id);
		let availableSpaces = await controller.view();

		expect(filled).toBe(true);
		let foundSpace = _.any(availableSpaces, (space) => (space.attributes.name ===spotOne.name));
		expect(foundSpace).toEqual(false); //check syntax

	});

	test('It should fill un-assigned spaces', async () => {
		let created = await controller.create(spotOne);
		let filled = await controller.take(created.id);
		let availableSpaces = await controller.view();

		expect(filled).toBe(true);
		let foundSpace = _.any(availableSpaces, (space) => (space.attributes.name ===spotOne.name));
		expect(foundSpace).toEqual(false); //check syntax

	});


	/*
	test('It should count assigned un-filled spaces', async () => {


	});
	*/

});

	