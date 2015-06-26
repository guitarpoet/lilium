let core = require('../../core.js');

describe("core.ajax.suite", function() {
	it("xhr.test", function() {
		let a = new core.Ajax();
		expect(typeof a.xhr).toBe('object');
	});

	it("local.test", function() {
		expect(typeof hello).toBe('undefined');
		var hello = local('hello', function(){});
		expect(typeof hello).toBe('function');
	});

	it("functionName.test", function() {
		expect(functionName(def)).toBe('defineIfNotExists');
	});
});

