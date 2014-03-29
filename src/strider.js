YUI.add('strider', function(Y) {
	
	var Strider = function(config) {
		Strider.superclass.constructor.apply(this, arguments);
	}
	
	Strider.NAME = "strider";
	
	Strider.ATTRS = {
		striderNode: {
			readOnly: true
		},
		
		contextNode: {
			readOnly: true
		}
	};
	
	Y.extend(Strider, Y.Base, {
		initializer: function(config) {
			this._set('striderNode', Y.one(config.striderNode));
			this._set('contextNode', Y.one(config.contextNode));
		},
		
		destructor: function() {
		}
	});
	
	Y.Strider = Strider;
	
}, '0.0.1', {
	requires: ['base']
});