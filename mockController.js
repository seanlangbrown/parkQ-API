const _ = require('underscore');

module.exports = class mockController extends Object {

	constructor (mockable) {

		super();

		this.mocked = mockable;

		this.called = {};

		this.yield = {}

		this.nextYield = null;

		this.initializeYields();

	}

	initializeYields () {

		//console.log('initializeYields');
		//console.log(this.mocked);
		for (let key in this.mocked) {
			//console.log(key);
			this.resetYield(key);
		}
	}

	setYield (method, valOrCallback) {
		if (_.isFunction(valOrCallback)) {
			this.yield[method] = valOrCallback;
		} else if (_.isFunction(this.mocked[method])) {
			this.yield[method] = function() {return valOrCallback};
		} else {
			this.yield[method] = valOrCallback;
			this.updatePropYeilds();
		}
		
	}

	updatePropYeilds () {
		for (let key in this.yield) {
			if (!_.isFunction(this.mocked[key])) {
				this[key] = this.yield[key];
			}
		}
	}

	resetYield(key) {
		if (_.isFunction(this.mocked[key])) {
			this.mockFunction(key);
		} else {
			this.mockProperty(key);
		}
	}

	setNextYield (valOrCallback) {
		//overrides all else for next method call
		if (_.isFunction(valOrCallback)) {
			this.nextYield = valOrCallback;
		} else {
			this.nextYield = function() {return valOrCallback};
		}
	}

	mockFunction (name) {
		this.called[name] = {
					count: 0,
					args: [],
					yields: []
				};

		//console.log('mockfunction', this);

		this[name] = (...args) => {
			this.called[name].args.push(args);
			this.called[name].count++;
			let res;
			if (this.nextYield !== null) {
				res = _.isFunction(this.nextYield) ? this.nextYield.call(this.yield, ...args) : this.nextYield;
				this.nextYield = null;
			} else if (this.yield[name] !== undefined) {
				res = _.isFunction(this.yield[name]) ? this.yield[name].call(this.yield, ...args) : this.yeild[name];
			} else {
				res = this.mocked[name].call(this.yield, ...args);
				this.updatePropYeilds();
			}
			this.called[name].yields.push(res)// : this.called[name].yields.push(null);
			return res;
		}
	}

	mockProperty (name) {

		this.yield[name] = this.mocked[name]; //can be set later
		this.updatePropYeilds();
	}

}