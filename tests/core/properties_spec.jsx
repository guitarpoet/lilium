var core = require('../../core.js');
var sleep = embed('sleep');

class Bean extends lilium.core.PropertySource {
}

describe("core.properties.suite", function() {
	it("properties.source.test", function() {
		var b = new Bean();
		b.addEventListener('change', (e) => {
			expect(e.propertyName).toBe('a');
			expect(e.value).toBe(1);
		})
		b.set('a', 1);
	});
});
