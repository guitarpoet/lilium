//==============================================================================
//
// The fundation part, must at the very first of core, so name this using 0
//
// @author Jack
// @version 1.0
// @date Thu Jun 25 23:12:50 2015
//
//==============================================================================

if(typeof functionName !== 'function') {
	/**
	 * Get the name of the function, though, you can use function.name to get it,
	 * try this function for browser compatability
	 */
	var functionName = function(fun) {
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
	}
}

if(typeof provides !== 'function') {
	var provides = function(widgets, module) {
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
	}
}

provides([functionName, provides]);
