var core = require('../../core.js');
var sleep = require('sleep');

describe("core.ajax.suite", function() {
	it("xhr.test", function() {
		let clock = jasmine.clock().install();
		let a = new lilium.core.Ajax();
		expect(typeof a.xhr).toBe('object');
		a.timeout = 2000;
		a.exec('GET','http://localhost').then((data) => {
			console.log(data);
		}).catch((e) => {
			expect(e).toEqual('TIMEOUT');
			jasmine.done();
		});
		clock.tick(10000);
	});

	it("json.test", function() {
		let a = new lilium.core.Ajax();
		a.get('http://localhost/~jack/a.json', null, null, 'json').then((data) => {
			console.dir(data);
		}).catch((e) => {
			console.dir(e);
		});
		sleep.sleep(2);
	});
});
