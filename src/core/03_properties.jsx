//==============================================================================
//
// The fundation part, must at the very first of core, so name this using 0
//
// @author Jack
// @version 1.0
// @date Thu Jun 25 23:12:50 2015
//
//==============================================================================

+(function(){

/**
 * The simple property source base class to provde the base get and set functions
 */
class PropertySource extends lilium.core.EventSource {
	get(name, default_value) {
		return this[name]? this[name]: default_value;
	}

	set(name, value) {
		this.fire('change', {
			'target': this,
			'propertyName': name,
			'value': value,	
			'orig_value': this[name]
		});
		this[name] = value;
	}
}

class TreePropertySourceNode extends lilium.core.EventSource {
	constructor(name, parent, value) {
		super();
		this.parent = parent;
		if(parent && parent instanceof TreePropertySourceNode) {
			parent.appendChild(this);
		}
		this.name = name;
		if(value)
			this.value = value;
	}

	removeChild(child) {
		if(child && this.children) {
			child.parent = null;
			lilium.removeElement(this.children, child);	
			events.off(child, 'change'); // Remove all the change listeners
		}
	}

	appendChild(child) {
		if(!this.children)
			this.children = [];
		this.children.push(child);
		child.parent = this;
	}

	path() {
		let path = [];
		let n = this;
		while(n) {
			path.unshift(n.name);	
			n = n.parent;
		}
		return path.join('.');
	}

	/**
	 * Generate the children tree
	 */
	childTree(names) {
		if(lilium.isArray(names)) {
			var cs = [];
			var child = null;
			while(names.length) {
				child = this.child(lilium.clone(names));
				if(child) {
					break;
				}

				var n = names.pop();
				if(n) {
					cs.unshift(n);
				}
			}

			var p = child? child: this;
			for(let c of cs) {
				child = new TreePropertySourceNode(c, p);	
				p = child;
			}
			return child;
		}
		else {
			return this.childTree(names.split("."));
		}
	}

	/**
	 * Get the child by its name
	 */
	child(names) {
		if(lilium.isArray(names)) {
			let node = this;
			while(names.length) {
				let n = names.shift();
				if(n) {
					node = node.child(n);		
					if(!node)
						break;
				}
			}
			if(node != this)
				return node;
		}
		else {
			if(this.children) {
				for(let child of this.children) {
					if(child.name == names)
						return child;
				}
			}
		}
		return null;
	}
}

class TreePropertySource extends TreePropertySourceNode {
	get(name, default_value) {
		let n = this.childTree(name);
		return n? n.value: default_value;	
	}

	change(name, func) {
		var n = this.childTree(name);
		if(n) {
			n.addEventListener('change', func);
		}
		return this;
	}

	set(name, value) {
		var n = this.childTree(name);
		var event = {
			'target': n,
			'currentTarget': n,
			'propertyName': name,
			'value': value,	
			'orig_value': n.value
		};

		var p = n;
		// balloon event
		while(p && !event.stop) {
			event.currentTarget = p;
			p.fire('change', event);
			p = p.parent;
		}

		n.value = value;
	}
}

provides([PropertySource, TreePropertySourceNode, TreePropertySource], 'core');

})();
