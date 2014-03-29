YUI({filter:'raw'}).use('test-console', 'strider', 'node', function (Y) {

	var testCase = new Y.Test.Case({
		name: "Strider Tests",

		setUp: function() {
		},
		
		tearDown: function() {
			Y.StriderManager.destroyAll();
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
    
    
    // Render the console inside the #log div, then run the tests.
    new Y.Test.Console().render('#log');
    Y.Test.Runner.add(testCase);
    Y.Test.Runner.run();

});