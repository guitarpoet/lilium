class Ajax {
	constructor() {
		this.xhr = this.getXhr();
	}

	exec(method, url, data, headers) {
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
						resolve(this.xhr.responseText, xhr);
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
