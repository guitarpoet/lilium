//==============================================================================
//
// The widget part, this part will define the widget architecture
//
// @author Jack
// @version 1.0
// @date Sat Jul 25 18:04:26 2015
//
//==============================================================================

+(function(){

// The default widget resolver
var widget = lilium.local('widget', (name) => {
	lilium._widgets = lilium._widgets || {};

	if(lilium._widgets[name]) {
		return new Promise((resolve, reject) => {
			resolve(lilium._widgets[name]);
		});
	}

	var widget_base = lilium.config('widget_base', '');
	var widget_config = lilium.paths([widget_base, name, 'package.json']).join();
	if(lilium.inNode()) {
		return new Promise((resolve, reject) => {
			var fs = require('fs');
			var data = fs.readFileSync(lilium.paths([process.cwd(), widget_config]).join());
			lilium._widgets[name] = new Widget(JSON.parse(data));
			lilium._widgets[name].init(() => {
				lilium._widgets[name].require();
				resolve(lilium._widgets[name]);
			});
		});
	}
	else {
		return new Promise((resolve, reject) => {
			let widget_url = lilium.siteUrl(widget_config);
			lilium.ajax().get(widget_url).then((data) => {
				let w = new Widget(JSON.parse(data));
				w.widgetBase = widget_base;
				lilium._widgets[name] = w;
				w.init(() => {
					w.require();
					resolve(w);
				});
			}).catch((e) => {
				reject(e);
			});
		});
	}
});

/**
 * The widget class, this will represent all the metadata information a widget
 * has. The metadata is from widget's package.json
 */
class Widget {

	constructor(config, init_callback) {
		lilium.copy(config, this); // Copy all the configurations
	}

	init(callback) {
		if(this.dependencies) {
			this.count = 0;
			for(let p in this.dependencies) {
				this.count++;
				widget(p).then((w) => {
					this.count--;
				}).catch((e) => {
					console.dir(e);
					this.count--;
				});
			}
			this._init_dep = setInterval(() => {
				if(this.count) // If still have dependencies not loaded
					return;

				if(callback) {
					callback(this);
				}
				clearInterval(this._init_dep);
			}, 10);
		}
		else {
			if(callback) {
				callback(this);
			}
		}
	}

	require(type) {
		if(!type) { // If no type is set, default to require all
			this.require('js');
			this.require('css');
		}
		else {
			switch(type) {
				case 'js':
					this.requireJs();
					break;
				case 'css':
					this.requireCss();
					break;
			}
		}
	}

	requireJs() {
		if(this.provides && this.provides.js) {
			let js = this.provides.js;
			if(!lilium.isArray(js)) {
				js = [js];
			}

			if(!lilium.inNode()) { // Skip if in node, will use node's require to get the module
				for(let j of js) {
					let script = lilium.e('script', null, {
						src: lilium.siteUrl(lilium.paths([this.widgetBase, this.name, 'js', j]).join()),
						type: 'text/javascript'
					}, 
					{ 'data-widget': this.name });
					document.getElementsByTagName("body")[0].appendChild(script);
				}
			}
		}
	}

	requireCss() {
		if(this.provides && this.provides.css) {
			let css = this.provides.css;
			if(!lilium.isArray(css)) {
				css = [css];
			}

			if(lilium.inNode()) { // Add this css to context
				for(let c of css) {
					lilium.context('css', c, true);
				}
			}
			else { // Add this css to browser
				for(let c of css) {
					let link = lilium.e('link', null, {
						href: lilium.siteUrl(lilium.paths([this.widgetBase, this.name, 'css', c]).join()),
						rel: 'stylesheet',
						type: 'text/css'
					}, 
					{ 'data-widget': this.name });
					document.getElementsByTagName("head")[0].appendChild(link);
				}
			}
		}
	}
}

provides([Widget, widget], 'core');

})();
