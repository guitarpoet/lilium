describe("core.base.suite", function() {
	it("functionName.test", function() {
		let base = require('../../core.js');
		expect(base.functionName(base.provides)).toBe('provides');
	});
});
