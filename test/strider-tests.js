YUI.add('strider-tests', function(Y) {

	var SCROLL_PADDER_ID = "testScrollPadder";
	
	var scrollWindowTo = function(scrollPosition) {
		Y.config.doc.documentElement.scrollTop = Y.config.doc.body.scrollTop = scrollPosition;
		
		Y.StriderManager._updateAll();
	};
	
	var testCase = new Y.Test.Case({
		name: "Strider Tests",

		setUp: function() {
			// added a very tall element to the bottom of the page so that we don't hit the bottom during tests
			Y.one(document.body).append('<div id="'+SCROLL_PADDER_ID+'" style="9999px">');
			
			scrollWindowTo(0);
		},
		
		tearDown: function() {
			// destroy any striders created during tests
			Y.StriderManager.destroyAll();
			
			// remove the tall element added to the bottom of the page
			Y.one('#'+SCROLL_PADDER_ID).remove();
			
			scrollWindowTo(0);
		},
		
		verifyNodeIdentityTypeAndClassName: function( node, identity, type, className ) {
			Y.Assert.isInstanceOf( type, node );
			Y.Assert.areEqual( identity, node );
			Y.assert( node.hasClass(className), "'" + className + "' in node's classes: ["+node.get('className').split(/\s/)+"]" );
		},
		
		"strider node attributes are set correctly when provided as selectors": function() {
			// given
				var striderNodeSelector = '#container1 h1';
				var contextNodeSelector = '#container1';
			
			// when
				var strider = new Y.Strider({
					striderNode: striderNodeSelector,
					contextNode: contextNodeSelector
				});
			
			// then
				this.verifyNodeIdentityTypeAndClassName( strider.get('striderNode'), Y.one(striderNodeSelector), Y.Node, 'strider-node');
				this.verifyNodeIdentityTypeAndClassName( strider.get('contextNode'), Y.one(contextNodeSelector), Y.Node, 'strider-context');
		},
		
		"strider node attributes are set correctly when provided as nodes": function() {
			// given
				var striderNode = Y.one('#container1 h1');
				var contextNode = Y.one('#container1');

			// when
				var strider = new Y.Strider({
					striderNode: striderNode,
					contextNode: contextNode
				});
			
			// then
				this.verifyNodeIdentityTypeAndClassName( strider.get('striderNode'), striderNode, Y.Node, 'strider-node');
				this.verifyNodeIdentityTypeAndClassName( strider.get('contextNode'), contextNode, Y.Node, 'strider-context');
		},
		
		"strider node attributes can't be changed": function() {
			// given
				var striderNode = Y.one('#container1 h1');
				var contextNode = Y.one('#container1');
				
				var strider = new Y.Strider({
					striderNode: striderNode,
					contextNode: contextNode
				});
			
			// when
				strider.set('striderNode', 'foo');
				strider.set('contextNode', 'bar');
			
			// then
				Y.Assert.areEqual( striderNode, strider.get('striderNode') );
				Y.Assert.areEqual( contextNode, strider.get('contextNode') );
		},
		
		"strider is not striding when scrolled to the top of the page": function() {
			// given
				var strider = new Y.Strider({
					striderNode: '#container1 h1',
					contextNode: '#container1'
				});
			
			// when
				scrollWindowTo(0);
			
			// then
				Y.assert( !strider.isStriding(), "strider should not be striding" );
		},
		
		"strider is not striding when scrolled to just at the context's top": function() {
			// given
				var strider = new Y.Strider({
					striderNode: '#container1 h1',
					contextNode: '#container1'
				});
			
			// when
				scrollWindowTo( Y.one('#container1').getY() );
			
			// then
				Y.assert( !strider.isStriding(), "strider should not be striding" );
		},
		
		"strider is striding when scrolled to just below the context's top": function() {
			// given
				var strider = new Y.Strider({
					striderNode: '#container1 h1',
					contextNode: '#container1'
				});
			
			// when
				scrollWindowTo( Y.one('#container1').getY() + 1 );
			
			// then
				Y.assert( strider.isStriding(), "strider should be striding" );
		},
		
		"all strider classes are removed when destroyed": function() {
			// given
				var strider = new Y.Strider({
					striderNode: '#container1 h1',
					contextNode: '#container1'
				});
			
			// when
				strider.destroy();
			
			// then: there should be no 'strider-' classes left on any of the nodes
				var striderNodeClassNames = strider.get('striderNode').get('className').split(/\s/);
				var contextNodeClassNames = strider.get('contextNode').get('className').split(/\s/);
				
				Y.Array.each(striderNodeClassNames.concat(contextNodeClassNames), function(className) {
					Y.assert( !/strider-/.test(className), "'" + className + "' should not start with 'strider-" );
				});
		},
		
		/* TODO: replace this with a test that doesn't know the implementation details of width and height.
			Instead, do something like make sure the rest of the content in the container is at the same position
			after a scroll triggers striding and/or that the context has the same dimensions
		 */
		"placeholder node created before strider with same dimensions when not provided": function() {
			// when
			var strider = new Y.Strider({
				striderNode: '#container1 h1',
				contextNode: '#container1'
			});
			
			// then
			var placeholderNode = strider.get('placeholderNode');
			var striderNode = strider.get('striderNode');
			
			Y.assert( placeholderNode.next() === striderNode );
			Y.Assert.areEqual( placeholderNode.get('height'), striderNode.get('height') );
			Y.Assert.areEqual( placeholderNode.get('width'), striderNode.get('width') );
		}
	});
    
    
    Y.striderTestCase = testCase;

}, '0.0.1', {
	requires: ['strider', 'node', 'test']
});