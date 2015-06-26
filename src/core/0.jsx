//==============================================================================
//
// The fundation part, must at the very first of core, so name this using 0
//
// @author Jack
// @version 1.0
// @date Thu Jun 25 23:12:50 2015
//
//==============================================================================

if(typeof functionName !== 'global') {
	var global = function(name, value) {
		if(typeof window === 'undefined') { // Add global support for nodejs
			var window = GLOBAL;
		}
		
		if(typeof value === 'undefined') {
			return window[name];
		}
		else {
			window[name] = value;
		}
	}
}

if(typeof functionName !== 'defineIfNotExists') {
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

	var def = defineIfNotExists;

	def('def', def); // Define the def function to global
}

def('global', global); // Define the global function to global

def('local', function(name, func) {
	let f = global(name);
	if(typeof f === 'function') {
		return f;
	}
	return func;
});

/**
 * Get the name of the function, though, you can use function.name to get it,
 * try this function for browser compatability
 */
def("functionName", function(fun) {
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

def('provides', 
	 function(widgets, module) {
		if(Object.prototype.toString.call(widgets) === '[object Array]' ) {
			for(var i = 0;i < widgets.length; i++) {
				exports[functionName(widgets[i])] = widgets[i];
			}
		}
		else {
			if(typeof widgets === 'function') {
				exports[functionName(widgets)] = widgets;
			}
		}
});

provides([global, local, defineIfNotExists, def, functionName, provides]);
