


describe ('Queue Controller', () => {

	
	beforeAll( async () => {

		//initialize 

	});



	test('It should create spaces', async () => {


	});



	test('It should count all spaces in the system', async () => {


	});



	test('It should count the number of available spaces', async () => {


	});



	test('It should return all available spaces', async () => {


	});



	test('It should assign spaces', async () => {


	});


	test('It should assign spaces in the order released', async () => {



		/*

		const newSpace = await supertest(spacesAPI).post('/create');

		const newSpaceTwo = await supertest(spacesAPI).post('/create');

		const newSpaceThree = await supertest(spacesAPI).post('/create');

		const assignedSpace = await supertest(spacesAPI).get('/space');

		const assignedSpaceTwo = await supertest(spacesAPI).get('/space');

		const assignedSpaceThree = await supertest(spacesAPI).get('/space');

		expect(assignedSpace.toEqual(spaceOne));

		expect(assignedSpace.statusCode.toBe(200));

		expect(assigedSpaceTwo.statusCode.toBe(200));

		expect(assignedSpactThree.statusCode.toBe(200));

		expect(assignedSpaceThree.toEqual(spaceThree));

		*/

	});


	test('It should release spaces and add them to the assignment queue', async () => {


	});



	test('It should release spaces if not filled by timeout and return them to the assignment queue', async () => {


	});



	test('It should fill assigned spaces', async () => {


	});

	test('It should fill un-assigned spaces', async () => {


	});


	test('It should count assigned un-filled spaces', async () => {


	});

});

	