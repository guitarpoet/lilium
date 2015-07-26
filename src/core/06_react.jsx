+(function(){

let parseJsx = lilium.local('parseJsx', () => {
	if(!lilium.inNode()) {
		for(let e of document.getElementsByTagName('jsx')) {
			var r = document.createElement('div');
			e.parentNode.replaceChild(r, e);
			React.render(eval(babel.transform(e.innerHTML).code), r);
		}
	}
});

provides([parseJsx], 'core');
})();
