let core = require('../../core.js');

describe("core.base.suite", function() {
	it("global.test", function() {
		global('test', 1);
		expect(test).toBe(1);
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
