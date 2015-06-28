require('../../core.js');
require('../../ds.js');


var data = {
	a: {
		name: "root",
		b: {
			name: "branch",
			c: {
				name: "leaf",	
				value: 1
			}
		}
	}
};
describe("ds.datastore.suite", function() {
	it("datastore.copy.test", function() {
		let ds = new lilium.ds.DataStore(data);
		expect(ds.childTree('a.b').path()).toBe('a.b');
		expect(ds.get('a.b.c.value')).toBe(1);
		expect(ds.get('a.b.c.name')).toBe('leaf');

	});
	it("datastore.entries.test", function() {
		let ds = new lilium.ds.DataStore(data);
			
		var result = [];
		for(let e of ds.entries()) {
			result.push(e.key());
		}

		expect(result).toEqual(['a', 'a.name', 'a.b', 'a.b.name', 'a.b.c', 'a.b.c.name', 'a.b.c.value']);
	});
});