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

// Polyfills
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

class Paths {
	constructor(paths) {
		this._paths = [];
		if(!lilium.isArray(paths)) {
			paths = [paths];
		}
		for(let path of paths) {
			this.append(path);
		}
	}

	append(path) {
		if(!path || path == '')
			return;

		if(path.endsWith('/')) {
			this._paths.push(path.substring(0, path.length - 2));
		}
		else
			this._paths.push(path);

		return this;	
	}

	join() {
		return this._paths.join('/');
	}
}

class Lilium {

	paths(paths) {
		return new Paths(paths);
	}

	siteUrl(uri) {
		var func = this.local('site_url', null);
		if(func) {
			return func(uri);
		}

		var base = this.config('site_base', '');
		return this.paths([base, uri]).join();
	}

	e(tag, classes, attr) {
		var el = document.createElement(tag);
		if(classes) {
			if(!this.isArray(classes)) {
				classes = [classes];
			}
			for(let c of classes) {
				el.classList.add(c);
			}
		}

		if(attr) {
			for(let p in attr) {
				el.setAttribute(p, attr[p]);
			}
		}
		return el;
	}

	select(selector) {
		return document.querySelectorAll(selector); // This won't support ie below 8, and fuck it
	}

	setConfig(key, value) {
		this._config[key] = value;
	}

	config(key, defaultValue) {
		if(this._config[key]) {
			return this._config[key];
		}
		return defaultValue;
	}

	sourceMap() {
		if(this.inNode()) {
			require('source-map-support').install();
		}
	}

	context(key, value, append) {
		if(typeof this._context === 'undefined') {
			this._context = {};
		}

		if(append) {
			let item = this._context[key];
			if(item) {
				if(this.isArray(item)) {
					item.push(value);
				}
				else {
					this._context[key] = [item, value];
				}
			}
			else {
				this._context[key] = [value];
			}
		}
		else {
			if(value)
				this._context[key] = value;
			else
				return this._context[key];
		}
	}

	context_unset(key) {
		if(this.context(key)) {
			delete this._context[key];
		}
	}

	context_pop(key) {
		let a = this.context(key);
		if(a) {
			if(this.isArray(a)) {
				if(a.length)
					return a.pop();
				else {
					this.context_unset(key);
					return null;
				}
			}
			else {
				this.context_unset(key); // Remove the item from context if there is nothing
				return a;
			}
		}
	}

	context_shift(key) {
		let a = this.context(key);
		if(a) {
			if(this.isArray(a)) {
				if(a.length)
					return a.shift();
				else {
					this.context_unset(key);
					return null;
				}
			}
			else {
				this.context_unset(key); // Remove the item from context if there is nothing
				return a;
			}
		}
	}

	copy(src, dest,copy_functions) {
		let d = dest || {};
		for(let p in src) {
			if(this.isFunction(src[p]) && !copy_functions) {
				continue;
			}	
			d[p] = src[p];
		}

		if(copy_functions && src.__proto__ && d.__proto__
			&&src.__proto__ != d.__proto__) {
			this.copyObject(src.__proto__, d.__proto__);
		}
		return d;
	}

	isFunction(func) {
		var getType = {};
		return func && getType.toString.call(func) === '[object Function]';
	}

	getCookie(name) {
	  var value = "; " + document.cookie;
	  var parts = this.split(value, "; " + name + "=");
	  if (parts.length == 2) return this.split(parts.pop(), ";").shift();
	}

	split(s, sep) {
		return s.split(sep || ' ');
	}

	isString(o) {
		return typeof o === 'string' || o instanceof String;
	}

	isObject(o) {
		return o && (typeof o === "object");
	}

	inNode() {
		return typeof GLOBAL == 'object';
	}

	global(name, value) {
		let w = null;
		if(typeof window === 'undefined') { // Add global support for nodejs
			w = GLOBAL;
		}
		else {
			w = window;
		}
		
		if(name) {
			if(typeof value === 'undefined') {
				return w[name];
			}
			else {
				w[name] = value;
			}
		}
		return w;
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

	removeElement(a, e) {
		if(this.isArray(a)) {
			let index = a.indexOf(e);
			if(index != -1)
				return a.splice(index, 1);
		}
		return [];
	}

	clone(a) {
		if(this.isArray(a))
			return a.slice(0);	
		if(this.isObject(a)) {
			let ret = {};
			for(let p in a) {
				ret[p] = a[p];
			}
			return ret;
		}
		return null;
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

lilium._config = lilium.copy(lilium.local('lilium_config', {}), {
	widget_base: lilium.inNode()? 'node_modules' : 'widgets'
});

lilium.sourceMap(); // Map the source codes to ease the debug process.

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
 * Provide the widget and functions for module. This function will direct provide the Classes to the global lilium namespace
 * And if in browser context, won't provide any access to these exports other than global lilium namespace.
 */
def('provides', (widgets, module, global) => {
	var e = null;

	if(!module) // lilium widgets are the default module
		module = 'widgets';

	if(typeof exports !== 'undefined') { // Prefer nodejs environment
		e = exports;
	}
	else if(typeof window !== 'undefined') {
		e = {};	
	}

	if(lilium.isArray(widgets)) {
		for(let widget of widgets) {
			e[lilium.getName(widget)] = widget;
		}
	}
	else {
		e[lilium.getName(widgets)] = widgets;
	}
	
	lilium[module] = lilium[module] || {};

	if(global) {
		var g = lilium.global(module) || {};
	}

	for(let k in e) {
		lilium[module][k] = e[k];
		if(global) {
			g[k] = e[k];
		}
	}

	if(global) {
		lilium.global(module, g);
	}
});

provides([Lilium, def], 'core');

})();
