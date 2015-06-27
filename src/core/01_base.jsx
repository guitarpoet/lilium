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

class Lilium {
	global(name, value) {
		if(typeof window === 'undefined') { // Add global support for nodejs
			var window = GLOBAL;
		}
		
		if(name) {
			if(typeof value === 'undefined') {
				return window[name];
			}
			else {
				window[name] = value;
			}
		}
		return global;
	}

	local(name, func) {
		let f = this.global(name);
		if(typeof f === 'function') {
			f.alias = name;
			return f;
		}
		if(func)
			func.alias = name;
		return func;
	}

	/**
	 * Test if the function is exists, if not exists then define it
	 * NOTE: This will define the function into the global environment
	 */
	defineIfNotExists(name, func) {
		let f = this.global(name);
		if(typeof f === 'function') {
			f.alias = name;
			return f;
		}
		this.global(name, func);
		if(func)
			func.alias = name;
		return func;
	}

	isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}

	getName(o) {
		if(o) {
			if(typeof o.alias !== 'undefined') {
				return o.alias;
			}
			if(typeof o.name !== 'undefined') {
				return o.name;
			}
			let ret = o.toString();
			ret = ret.substr('function '.length);
			ret = ret.substr(0, ret.indexOf('('));
			return ret;
		}
		return null;
	}
}

var lilium = new Lilium();

lilium.defineIfNotExists('def', (name, func) => { return lilium.defineIfNotExists(name, func); });

def('lilium', lilium);
def('require', () => {}); // TODO: Define require if no require is defined
def('embed', (module) => {
	if(lilium[module]) {
		return lilium[module];
	}

	let m = require(module);
	if(m) {
		return m;
	}
	return null;
});

/**
 * Provide the widget and functions for module
 */
def('provides', (widgets, module) => {
	if(lilium.isArray(widgets)) {
		for(let widget of widgets) {
			exports[lilium.getName(widget)] = widget;
		}
	}
	else {
		exports[lilium.getName(widgets)] = widgets;
	}
	
	lilium[module] = lilium[module] || {};

	for(let k in exports) {
		lilium[module][k] = exports[k];
	}
});

provides([Lilium, def], 'core');

})();
