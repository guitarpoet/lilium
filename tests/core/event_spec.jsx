var core = require('../../core.js');

class EventSourceSample extends lilium.core.EventSource {
	test() {
		this.fire('hello', 'world');
	}
}

describe("core.event.suite", function() {
	it("simple.event.test", function() {
		let s = new EventSourceSample();

		var a = 1;

		s.addEventListener('hello', (e) => {
			a = 2;
			expect(e).toBe('world');
		});

		s.test(); // Fire the event
		expect(a).toBe(2);
	});
});
