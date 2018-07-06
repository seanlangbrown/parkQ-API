
const mocked = require('./mockController.js');
const _ = require('lodash');


describe('mocking an object', () => {

	let testObj;

	let mock;

	let emptyObj;

	beforeEach(() => {

		testObj = {

			add: function(a, b) {
				return a + b;
			},

			aFunc: function() {},

			aProp: null,

			incrementCount: function() {
				this.count++;
			},

			count: 0
		};

		emptyObj = {}
		emptyMock = new mocked(emptyObj);
		mock = new mocked(testObj);

		//console.log(mock);

	});


	test('it should contain called, yield and nextyield and the mocked object', () => {

		expect(emptyMock.called).toEqual({});

		expect(emptyMock.yield).toEqual({});

		expect(emptyMock.nextYield).toEqual(null);

		expect(emptyMock.mocked).toBe(emptyObj);
	});



	test('it should record calls, arguments and yields for all methods', () => {
		let callOne = mock.aFunc(100, 200);

		let callTwo = mock.add(1, 2);

		let callThree = mock.add(300, 1);

		//console.log('mock.called.aFunc', mock.called.aFunc);

		expect(mock.called.aFunc.yields).toEqual([callOne]);

		expect(mock.called.add.yields).toEqual([callTwo, callThree]);

		expect(mock.called.add.args).toEqual([[1, 2], [300, 1]]);

	});


	test('it should retain original functionality of object functions', () => {
		expect(_.isFunction(mock.aFunc)).toBe(true);
		expect(mock.aFunc()).toBe(testObj.aFunc());
		expect(mock.add).toBeAFunction;
		expect(mock.add(1, 2)).toBe(testObj.add(1, 2));
		expect(_.isFunction(mock.incrementCount)).toBe(true);
		mock.incrementCount();
		//console.log('81', mock.count, testObj.count);
		testObj.incrementCount();
		expect(mock.count).toBe(testObj.count);

	});

	test('it should retain original functionality of object properties', () => {
		expect(mock.aProp).toBe(testObj.aProp);
	});
	

	test('it should replace native methods with values', () => {
		mock.setYield('aFunc', 200);
		expect(mock.aFunc()).toBe(200);

	});

	test('it should replace native properties with values', () => {
		mock.setYield('aProp', 100);

		expect(mock.aProp).toBe(100);

	});



	test('it should replace native methods with callbacks', () => {
		mock.setYield('aFunc', (a, b) => (a * b));
		//console.log('107', mock);
		expect(mock.aFunc(100, 2.5)).toBe(250);

	});



	test('it should override yields with nextYield', () => {
		mock.setYield('aFunc', (a, b) => (a % b));
		mock.setNextYield(100);

		expect(mock.aFunc()).toBe(100);

	});



	test('it should record calls, arguments and yields for mocked yeilds', () => {
		mock.setYield('aFunc', (a, b) => (a % b));
		let argsOne = [100, 2];
		let callOne = mock.aFunc.apply(null, argsOne);

		mock.setNextYield(100);
		let callTwo = mock.aFunc();

		expect(mock.called.aFunc.yields).toEqual([callOne, callTwo]);
		expect(mock.called.aFunc.args).toEqual([[100, 2], []]);
		expect(mock.called.aFunc.count).toEqual(2);

	});



});