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

	get (item) {
		if (!this.head) {
			return null;
		}
		let dequed = this.head;
		if (this.head.next) {
			this.head = this.head.next;
		}
		this.length--;
		return dequed.data;
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
		let foundItem = null;
		for (var i = 0; i < this.length; i++) {
			let item = this.get();
			if (item[property] === value) {
				foundItem = item;
			} else {
				this.put(item);
			}
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
			time: this.assignedAt
		}
	}
}

const spotQueue = new Queue();
const assignedSpots = {};

module.exports.assign = function() {
	return new Promise((resolve, reject) => {
		let openSpot = spotQueue.get()
		if (openSpot === null) {
			return {};
		}
		openSpot.assign(); //300, spotQueue);
		assignedSpots[openSpot.id] = openSpot;
		return openSpot.json();
	});
}

module.exports.view = function() {
	return new Promise((resolve, reject) => {
		let emptySpots = spotQueue.toArray();
		return emptySpots;
	});
}

module.exports.count = function() {
	return new Promise((resolve, reject) => {
		return spotQueue.length;
	});
}

module.exports.take = function(id) {
	return new Promise((resolve, reject) => {
		if (assignedSpots[id] === undefined) {
			let spot = spotQueue.find("id", id);
			if (spot !== null) {
				assignedSpots[id] = spot;
			}
		}
		if (assignedSpots[id] !== undefined) {
			assignedSpots[id].fill();
			resolve(true);
		}
		resolve(false);
	});
}

module.exports.isSpace = function(id) {
	return new Promise((resolve, reject) => {
		if (assignedSpots[id] === undefined) {
			if (spotQueue.find('id', id) === null) {
				resolve(false);
			}
		}
		resolve(true);
	});
}

module.exports.create = function(newSpot) {
	return new Promise((resolve, reject) => {
		resolve(true);
	});
}


module.exports.release = function(id) {
	return new Promise((resolve, reject) => {
		let openSpot;
		console.log('releasing space');
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