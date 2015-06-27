var core = require('../../core.js');
var sleep = embed('sleep');

describe("core.ajax.suite", function() {
	it("xhr.test", function() {
		let clock = jasmine.clock().install();
		let a = new lilium.core.Ajax();
		expect(typeof a.xhr).toBe('object');
		a.timeout = 2000;
		a.exec('GET','http://localhost').then((data) => {
			console.info('A');
			console.log(data);
		}).catch(() => {
			console.info('B');
		});
		clock.tick(10000);
	});
});
