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

}



class Spot extends Object {

	constructor(id) {
		super();
		this.id = id;
		this.assignedAt = null;
		this.type = 1;
	}

	assign(time) {
		this.assignedAt = time;
	}

	json() {
		return {
			id: this.id,
			type : this.type,
			time: this.assignedAt
		}
	}
}

const spotQueue = new Queue();


module.exports.assign = function() {
	let openSpot = spotQueue.get()
	if (openSpot === null) {
		return {};
	}
	openSpot.assign(Date.now());
	return openSpot.json();
}

module.exports.view = function() {
	let emptySpots = [];
	for (var i = 0; i < spotQueue.length; i++) {
		let spot = spotQueue.get();
		emptySpots.push(spot);
		spotQueue.put(spot);
	}
	return emptySpots;
}


module.exports.release = function(id) {
	let openSpot = new Spot(id);
	spotQueue.put(openSpot);
}