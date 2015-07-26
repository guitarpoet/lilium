var core = require('../../core.js');

describe("core.base.suite", function() {
	it("global.test", function() {
		lilium.global('test', 1);
		expect(test).toBe(1);
	});

	it("provide.test", function() {
		function test() {};
		provides(test, 'hello', true);
		expect(hello).not.toBeNull();
		expect(hello.test).not.toBeNull();
	});

	it("local.test", function() {
		expect(typeof hello).toBe('undefined');
		var hello = lilium.local('hello', function(){});
		expect(typeof hello).toBe('function');
	});

	it("getName.test", function() {
		expect(lilium.getName(def)).toBe('def');
	});

	it("copy.test", function() {
		let orig = {a:1, b:2};
		expect(lilium.copy(orig)).toEqual(orig);
		let neworig = lilium.copy(orig);
		neworig.func = function(){};
		expect(lilium.copy(neworig)).toEqual(orig);
		expect(lilium.copy(neworig, null, true)).toEqual(neworig);
	});

	it("paths.test", function() {
		expect(lilium.paths(['a', 'b', 'c']).join()).toEqual('a/b/c');
	});

	it("context.test", function() {
		lilium.context('test', 'test');
		expect(lilium.context('test')).toEqual('test');
		lilium.context('test', 'test', true);
		expect(lilium.context('test')).toEqual(['test', 'test']);
		lilium.context('test', 'test', true);
		expect(lilium.context('test')).toEqual(['test', 'test', 'test']);
		lilium.context_unset('test');
		expect(lilium.context('test')).toEqual(undefined);
	});
});
