YUI.add('strider', function(Y) {
	
	var StriderManager = function() {
		this.striderMap = {};
		
		this._eachStrider = function(fn) {
			for (var guid in this.striderMap) {
				if (this.striderMap.hasOwnProperty(guid)) {
					fn.call(this, this.striderMap[guid]);
				}
			}
		};
		
		this._add = function(strider) {
			strider._managerGuid = YUI.guid('strider-manager-');
			this.striderMap[strider._managerGuid] = strider;
		};
		
		this._remove = function(strider) {
			delete this.striderMap[strider._managerGuid];
		};
		
		this._update = function(strider) {
			strider._update();
		};
		
		this._updateAll = function() {
			this._eachStrider(function(strider) {
				strider._update();
			});
		};
		
		this.destroyAll = function() {
			this._eachStrider(function(strider) {
				strider.destroy();
			});
		};
	};
	
	var striderManager = new StriderManager();
	
	Y.one(Y.config.win).on('scroll', function(event) {
		striderManager._updateAll();
	}, this, true);
	
	/*==========================================================*/
	
	var Strider = function(config) {
		Strider.superclass.constructor.apply(this, arguments);
		
		this._striding = false;
	}
	
	Strider.NAME = "strider";
	
	Strider.ATTRS = {
		striderNode: {
			readOnly: true
		},
		
		contextNode: {
			readOnly: true
		},
		
		placeholderNode: {
			readOnly: true
		}
	};
	
	Strider.NODE_CLASSNAME = 'strider-node';
	Strider.CONTEXT_CLASSNAME = 'strider-context';
	Strider.PLACEHOLDER_CLASSNAME = 'strider-placeholder';
	Strider.STRIDING_CLASSNAME = 'strider-striding'
	
	Y.extend(Strider, Y.Base, {
		_striding: null,
		
		_createPlaceholder: function() {
			var placeholder = Y.Node.create('<div>');
			placeholder.set('width', this.get('striderNode').get('width'));
			placeholder.set('height', this.get('striderNode').get('height'));
			return placeholder;
		},
		
		_isPageScrolledBeyondContextTop: function() {
			return Y.DOM.docScrollY() > this.get('contextNode').getY();
		},
		
		_update: function() {
			var shouldBeStriding = this._isPageScrolledBeyondContextTop();
			
			this._striding = shouldBeStriding;
			this.get('striderNode').toggleClass(Strider.STRIDING_CLASSNAME, shouldBeStriding);
		},
		
		initializer: function(config) {
			striderManager._add(this);
			
			this._set('striderNode', Y.one(config.striderNode));
			this.get('striderNode').addClass(Strider.NODE_CLASSNAME);
			
			this._set('contextNode', Y.one(config.contextNode));
			this.get('contextNode').addClass(Strider.CONTEXT_CLASSNAME);
			
			if (!config.placeholderNode) {
				this._set('placeholderNode', this._createPlaceholder());
				this.get('placeholderNode').addClass(Strider.PLACEHOLDER_CLASSNAME);
				this.get('striderNode').insert(this.get('placeholderNode'), 'before');
			}
		},
		
		destructor: function() {
			striderManager._remove(this);
			
			this.get('striderNode').removeClass(Strider.NODE_CLASSNAME);
			this.get('striderNode').removeClass(Strider.STRIDING_CLASSNAME);
			this.get('contextNode').removeClass(Strider.CONTEXT_CLASSNAME);
			this.get('placeholderNode').remove();
		},
		
		isStriding: function() {
			return this._striding;
		}
		
	});
	
	Y.StriderManager = striderManager;
	Y.Strider = Strider;
	
}, '0.0.1', {
	requires: ['base','node']
});