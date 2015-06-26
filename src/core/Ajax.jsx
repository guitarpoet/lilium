class Ajax {
	constructor() {
		this.xhr = this.getXhr();
	}

	getXhr() {
		let f = global('XMLHttpRequest');
		if(typeof f !== 'undefined') {
			return new f();
		}
		else {
			if(typeof ActiveXObject !== 'undefined')
				return new ActiveXObject("Microsoft.XMLHTTP");
			else {
				let XMLHttpRequest = embed('xhr2');
				return new XMLHttpRequest();
			}
		}
	}
}

provides([Ajax]);
