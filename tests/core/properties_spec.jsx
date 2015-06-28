var core = require('../../core.js');
var sleep = embed('sleep');

class Bean extends lilium.core.PropertySource {
}

describe("core.properties.suite", function() {
	it("properties.source.test", function() {
		let b = new Bean();
		b.addEventListener('change', (e) => {
			expect(e.propertyName).toBe('a');
			expect(e.value).toBe(1);
		})
		b.set('a', 1);
	});

	it("properties.tree.node.child.test", function() {
		let root = new lilium.core.TreePropertySourceNode('root');
		let branch = new lilium.core.TreePropertySourceNode('branch', root);
		let leaf = new lilium.core.TreePropertySourceNode('leaf', branch, 1);
		expect(root.child(['branch', 'leaf']).value).toBe(1);
	});

	it("properties.tree.node.child.tree.test", function() {
		let root = new lilium.core.TreePropertySourceNode('root');
		let leaf = root.childTree('branch.leaf');
		leaf.value = 1;
		expect(root.child(['branch', 'leaf']).value).toBe(1);
		expect(root.childTree('branch.leaf').value).toBe(1);

		let branch = root.child('branch');
		branch.value = 2;

		let leaf2 = root.childTree('branch.leaf2');
		expect(leaf2.parent.value).toBe(2);
	});

	it("properties.tree.node.child.path.test", function() {
		let root = new lilium.core.TreePropertySourceNode('root');
		let leaf = root.childTree('branch.leaf');
		leaf.value = 1;
		expect(leaf.path()).toBe('root.branch.leaf');
	});

	it("properties.tree.node.iterator.test", function() {
		let root = new lilium.core.TreePropertySourceNode('root');
		let leaf = root.childTree('branch.leaf');
		leaf.value = 1;
		root.childTree('branch1.leaf');
		root.childTree('branch1.leaf2');
		root[Symbol.iterator] = () => { return new lilium.core.TreeNodeIterator(root); }; 
		var result = [];
		for(let i of root) {
			result.push(i.path());
		}
		expect(result).toEqual(['root.branch', 'root.branch.leaf', 'root.branch1', 'root.branch1.leaf', 'root.branch1.leaf2']);
	});

	it("properties.tree.property.source.base.test", function() {
		let source = new lilium.core.TreePropertySource();
		var count = [];
		source.addEventListener('change', (e) => {
			count.unshift('ALL');
		});

		source.change('a', (e) => {
			count.unshift('a');
		});

		source.change('a.b', (e) => {
			count.unshift('a.b');
		});

		source.change('a.b.c', (e) => {
			count.unshift('a.b.c');
		});

		source.set('a.b.c', 1);
		let c = source.childTree("a.b.c");
		expect(c.value).toBe(1);
		expect(count).toEqual(['ALL', 'a', 'a.b', 'a.b.c']);
	});
});
