var core = require('../../core.js');
var sleep = require('sleep');

describe("core.widget.suite", function() {
	it("load.test", function() {
		lilium.core.widget('xhr2');
		console.dir(lilium._widgets);
	});
});
