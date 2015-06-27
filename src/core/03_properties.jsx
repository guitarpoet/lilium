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

/**
 * The simple property source base class to provde the base get and set functions
 */
class PropertySource extends lilium.core.EventSource {
	get(name, default_value) {
		return this[name]? this[name]: default_value;
	}

	set(name, value) {
		this.fire('change', {
			'target': this,
			'propertyName': name,
			'value': value,	
			'orig_value': this[name]
		});
		this[name] = value;
	}
}

provides([PropertySource], 'core');

})();
