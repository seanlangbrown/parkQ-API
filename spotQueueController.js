class QueueNode extends Object {
	constructor (data) {
		super();
		this.next = null;
		this.data = data;
	}
	
}

class Queue extends Object {

	constructor () {
		super();
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	put (item) {
		let newNode = new QueueNode(item);
		if (!this.head) {
			this.head = newNode;
		} else {
			this.tail.next = newNode;
		}
		this.tail = newNode;

		this.length++;
	}
	get ()  {
		if (!this.head) {
			return null;
		}
		let dequed = this.head;
		if (this.head.next !== null) {
			this.head = this.head.next;
		} else {
			this.head = null;
			this.tail = null;
		}
		this.length--;
		return dequed.data;
	}

	geti (position) {
		if (position === 0) {
			return this.get();
		}
		let dequed = null;
		for (let i = 0; i < this.length; i++) {
			let node = this.get();
			if (i === position) {
				dequed = node;
			} else {
				this.put(node);
			}
		}
		this.length--;
		if (dequed !== null) {
			return dequed.data;
		} else {
			return null;
		}
	}

	toArray () {
		let arr = [];
		for (var i = 0; i < this.length; i++) {
			let spot = this.get();
			arr.push(spot);
			this.put(spot);
		}
		return arr;
	}

	find (property, value) {
		let foundItem = -1;
		for (var i = 0; i < this.length; i++) {
			let item = this.get();
			if (item[property] === value) {
				foundItem = i;
			}
			this.put(item);
		}
		return foundItem;
	}

}



class Spot extends Object {

	constructor(id) {
		super();
		this.id = id;
		this.assignedAt = null;
		this.type = 1;
		this.empty = true;
		this._attributes = {};
	}

	attributes(name, value) {
		if (value !== undefined) {
			this._attributes[name] = value;
			return;
		} else {
			return this._attributes[name];
		}
	}

	assign () { //timeout, reset) {
		this.assignedAt = Date.now();
	}

	fill () {
		this.empty = false;
	}

	release () {
		this.empty = true;
		this.assignedAt = null;
	}

	json () {
		return {
			id: this.id,
			type : this.type,
			time: this.assignedAt,
			attributes: this._attributes
		}
	}
}

let spotQueue = new Queue();
let assignedSpots = {};
let id = 0;

let nextId = function() {
	let newid = id;
	id++;
	return newid;
}

module.exports.connect = function () {
	return new Promise((resolve, reject) => {
		resolve(true);
	});
}

module.exports.disconnect = function() {
	return new Promise((resolve, reject) => {
		spotQueue = new Queue();
		assignedSpots = {};
		id = 0;
		resolve(true);
	});
}

module.exports.assign = function() {
	return new Promise((resolve, reject) => {
		let openSpot = spotQueue.get();
		if (openSpot === null) {
			resolve({});
		}
		openSpot.assign(); //300, spotQueue);
		assignedSpots[openSpot.id] = openSpot;
		resolve(openSpot.json());
	});
}

module.exports.view = function() {
	return new Promise((resolve, reject) => {
		let emptySpots = spotQueue.toArray().map((spot) => (spot.json()));
		resolve(emptySpots);
	});
}

module.exports.count = function() {
	return new Promise((resolve, reject) => {
		resolve(spotQueue.length);
	});
}

module.exports.take = function(id) {
	return new Promise((resolve, reject) => {
		if (assignedSpots[id] === undefined) {
			let spotPosition = spotQueue.find("id", id);
			//console.log('found', spotPosition);
			if (spotPosition !== null) {
				spot = spotQueue.geti(spotPosition);
				//console.log('spot is', spot);
				assignedSpots[id] = spot;
			}
		}
		if (assignedSpots[id] !== undefined && assignedSpots[id] !== null) {
			assignedSpots[id].fill();
			resolve(true);
		}
		resolve(false);
	});
}

module.exports.isSpace = function(id) {
	return new Promise((resolve, reject) => {
		//console.log('searching', assignedSpots, ', ', spotQueue);
		if (assignedSpots[id] === undefined) {
			if (spotQueue.find('id', id) === -1) {
				resolve(false);
			}
		}
		resolve(true);
	});
}

module.exports.create = function(newSpot) {
	return new Promise((resolve, reject) => {
		let spot = new Spot(nextId());
		for (let key in newSpot) {
			spot.attributes(key, newSpot[key]);
		}
		spotQueue.put(spot);
		resolve({'id': spot.id, 'success': true});
	});
}


module.exports.release = function(id) {
	return new Promise((resolve, reject) => {
		let openSpot;
		//console.log('releasing space');
		if (assignedSpots[id] !== undefined) {
			openSpot = assignedSpots[id];
			delete assignedSpots[id];
		} else {
			resolve(false);
		}
		openSpot.release();
		spotQueue.put(openSpot);
		resolve(true);
	});
}