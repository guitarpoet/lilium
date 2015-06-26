let core = require('../../core.js');

describe("core.ajax.suite", function() {
	it("xhr.test", function() {
		let a = new core.Ajax();
		expect(typeof a.xhr).toBe('object');
	});
});
