//==============================================================================
//
// The cross platform ajax support part. This part will support nodejs and
// all the mainstream browsers.
//
// Will use XMLHttpRequest as default implementation, and will use nodejs's
// xmlhttprequest as the implmenentation in nodejs.
//
// @author Jack
// @version 1.0
// @date Sat Jun 27 13:29:22 2015
//
//==============================================================================

+(function(){


/**
 * The Ajax api that uses ES6 Promise, you can use as this:
 * 
 * <code>
 * 		Ajax.get('/a.json')
 * 			.then(function(data) { console.info(data); })
 * 			.catch(function(error) { console.info(error); });
 * </code>
 */
class Ajax {
	constructor() {
		this.xhr = this.getXhr();
	}

	get(url, data, headers, type) {
		return this.exec('GET', url, data, headers, type);
	}

	post(url, data, headers, type) {
		return this.exec('POST', url, data, headers, type);
	}

	put(url, data, headers) {
		return this.exec('PUT', url, data, headers);
	}

	delete(url, headers) {
		return this.exec('DELETE', url, null, headers);
	}

	head(url, data, headers) {
		return this.exec('HEAD', url, data, headers);
	}

	exec(method, url, data, headers, type) {
		return new Promise((resolve, reject) => {
			let payload;
			let data = data || {};
			let headers = headers || {};

			// Generate payload
			payload = this._encode(data);
			if (method === 'GET' && payload) {
				url += '?' + payload;
				payload = null;
			}

			if(type == 'jsonp' && !lilium.inNode() && typeof document !== 'undefined') {

				// We're in the browser, and trying to getting the data through jsonp
				if(!Date.now){
					Date.now = function() { return new Date().getTime(); };
				}

				//Use timestamp + a random factor to account for a lot of requests in a short time
				//e.g. jsonp1394571775161 
				var timestamp = Date.now();
				var generatedFunction = 'jsonp'+Math.round(timestamp+Math.random()*1000001)

				//Generate the temp JSONP function using the name above
				//First, call the function the user defined in the callback param [callback(json)]
				//Then delete the generated function from the window [delete window[generatedFunction]]
				window[generatedFunction] = function(json){
					resolve(json);
					// IE8 throws an exception when you try to delete a property on window
					// http://stackoverflow.com/a/1824228/751089
					try {
						delete window[generatedFunction];
					} catch(e) {
						window[generatedFunction] = undefined;
					}
				};

				let script = document.createElement('script');
				if(url.indexOf('?') != -1) {
					url += '&callback=' + generatedFunction;
				}
				else {
					url += '?callback=' + generatedFunction;
				}
				script.setAttribute("src", url);
				document.getElementsByTagName("head")[0].appendChild(script)
				return;
			}

			// open xhr
			this.xhr.open(method, url);

			// Setting headers
			let content_type = this.content_type || 'application/x-www-form-urlencoded';
			for (let h in headers) {
				if (headers.hasOwnProperty(h)) {
					if (h.toLowerCase() === 'content-type')
						content_type = headers[h];
					else
						this.xhr.setRequestHeader(h, headers[h]);
				}
			}
			this.xhr.setRequestHeader('Content-type', content_type);

			// Handle timeout
			if(this.timeout && this.timeout > 0) {
				var xhr = this.xhr;
				this.timeout_handle = setTimeout(() => {
					reject('TIMEOUT', 'Ajax request to url ' + url + ' has timeout!');
					xhr.abort();
				}, this.timeout);
			}

			// Handle response
			this.xhr.onreadystatechange = () => {
				if (this.xhr.readyState === 4) {
					if (this.timeout_handle) {
						clearTimeout(this.timeout_handle);
					}
					if(!this.xhr.status || (this.xhr.status < 200 || this.xhr.status >= 300) && this.xhr.status !== 304) {
						reject(this.xhr.status, this.xhr.responseText, xhr);
					}
					else {
						let result = this.xhr.responseText;
						if(type == 'json' || type == 'jsonp') {
							result = JSON.parse(result);
						}
						resolve(result, xhr);
					}
				}
			};

			this.xhr.send(payload);
		});
	}

	_encode(data) {
		let payload = "";
		if (typeof data === "string") {
			payload = data;
		} 
		else {
			let e = encodeURIComponent;
			let params = [];

			for (let k in data) {
				if (data.hasOwnProperty(k)) {
					params.push(e(k) + '=' + e(data[k]));
				}
			}
			payload = params.join('&')
		}
		return payload;
	}

	getXhr() {
		if(typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		else {
			if(typeof ActiveXObject !== 'undefined')
				return new ActiveXObject("Microsoft.XMLHTTP");
			else {
				let x = embed('xmlhttprequest').XMLHttpRequest;
				return new x();
			}
		}
	}
}

provides([Ajax], 'core');

})();
