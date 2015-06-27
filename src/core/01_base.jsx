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

var root = this;

if(typeof global === 'undefined') {
	var global = function(name, value) {
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
}

if(typeof defineIfNotExists === 'undefined') {
	/**
	 * Test if the function is exists, if not exists then define it
	 * NOTE: This will define the function into the global environment
	 */
	var defineIfNotExists = function(name, func) {
		let f = global(name);
		if(typeof f === 'function') {
			return f;
		}
		global(name, func);
		return func;
	}

	defineIfNotExists('def', defineIfNotExists); // Define the def function to global
}

def('require', () => {}); // TODO: Define require if no require is defined

def('global', global); // Define the global function to global

global('lilium', {}); // Define the global lilium

def('local', (name, func) => {
	let f = global(name);
	if(typeof f === 'function') {
		return f;
	}
	return func;
});

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

var isArray = local('isArray', (o) => {
	return Object.prototype.toString.call(o) === '[object Array]';
});

/**
 * Get the name of the function, though, you can use function.name to get it,
 * try this function for browser compatability
 */
def("functionName", (fun) => {
		if(fun) {
			if(typeof fun.name !== 'undefined') {
				return fun.name;
			}
			let ret = fun.toString();
			ret = ret.substr('function '.length);
			ret = ret.substr(0, ret.indexOf('('));
			return ret;
		}
		return null;
});

def('provides', (widgets, module) => {
		if(isArray(widgets)) {
			for(let widget of widgets) {
				exports[functionName(widget)] = widget;
			}
		}
		else {
			exports[functionName(widgets)] = widgets;
		}
		
		lilium[module] = lilium[module] || {};

		for(let k in exports) {
			lilium[module][k] = exports[k];
		}
});

provides([global, local, defineIfNotExists, def, functionName, provides], 'core');

})();
