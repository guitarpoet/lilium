var core = require('../../core.js');

describe("core.base.suite", function() {
	it("global.test", function() {
		lilium.global('test', 1);
		expect(test).toBe(1);
	});

	it("local.test", function() {
		expect(typeof hello).toBe('undefined');
		var hello = lilium.local('hello', function(){});
		expect(typeof hello).toBe('function');
	});

	it("getName.test", function() {
		expect(lilium.getName(def)).toBe('def');
	});
});
