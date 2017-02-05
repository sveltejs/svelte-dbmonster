function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function teardownEach ( iterations, detach, start ) {
	for ( var i = ( start || 0 ); i < iterations.length; i += 1 ) {
		iterations[i].teardown( detach );
	}
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function createComment ( data ) {
	return document.createComment( data );
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

function renderMainFragment ( root, component ) {
	var table = createElement( 'table' );
	table.className = "table table-striped latest-data";
	
	var tbody = createElement( 'tbody' );
	
	appendNode( tbody, table );
	var eachBlock_anchor = createComment( "#each dbs" );
	appendNode( eachBlock_anchor, tbody );
	var eachBlock_value = root.dbs;
	var eachBlock_iterations = [];
	
	for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
		eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
		eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
		},
		
		update: function ( changed, root ) {
			var eachBlock_value = root.dbs;
			
			for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
				if ( !eachBlock_iterations[i] ) {
					eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
					eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
				} else {
					eachBlock_iterations[i].update( changed, root, eachBlock_value, eachBlock_value[i], i );
				}
			}
			
			teardownEach( eachBlock_iterations, true, eachBlock_value.length );
			
			eachBlock_iterations.length = eachBlock_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock_iterations, false );
			
			if ( detach ) {
				detachNode( table );
			}
		}
	};
}

function renderEachBlock ( root, eachBlock_value, db, db__index, component ) {
	var tr = createElement( 'tr' );
	
	var td = createElement( 'td' );
	td.className = "dbname";
	
	appendNode( td, tr );
	var text = createText( db.dbname );
	appendNode( text, td );
	appendNode( createText( "\n\n      " ), tr );
	
	var td1 = createElement( 'td' );
	td1.className = "query-count";
	
	appendNode( td1, tr );
	
	var span = createElement( 'span' );
	span.className = db.lastSample.countClassName;
	
	appendNode( span, td1 );
	var text2 = createText( db.lastSample.nbQueries );
	appendNode( text2, span );
	appendNode( createText( "\n\n      " ), tr );
	var eachBlock1_anchor = createComment( "#each db.lastSample.topFiveQueries" );
	appendNode( eachBlock1_anchor, tr );
	var eachBlock1_value = db.lastSample.topFiveQueries;
	var eachBlock1_iterations = [];
	
	for ( var i = 0; i < eachBlock1_value.length; i += 1 ) {
		eachBlock1_iterations[i] = renderEachBlock1( root, eachBlock_value, db, db__index, eachBlock1_value, eachBlock1_value[i], i, component );
		eachBlock1_iterations[i].mount( eachBlock1_anchor.parentNode, eachBlock1_anchor );
	}

	return {
		mount: function ( target, anchor ) {
			insertNode( tr, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, db, db__index ) {
			text.data = db.dbname;
			
			span.className = db.lastSample.countClassName;
			
			text2.data = db.lastSample.nbQueries;
			
			var eachBlock1_value = db.lastSample.topFiveQueries;
			
			for ( var i = 0; i < eachBlock1_value.length; i += 1 ) {
				if ( !eachBlock1_iterations[i] ) {
					eachBlock1_iterations[i] = renderEachBlock1( root, eachBlock_value, db, db__index, eachBlock1_value, eachBlock1_value[i], i, component );
					eachBlock1_iterations[i].mount( eachBlock1_anchor.parentNode, eachBlock1_anchor );
				} else {
					eachBlock1_iterations[i].update( changed, root, eachBlock_value, db, db__index, eachBlock1_value, eachBlock1_value[i], i );
				}
			}
			
			teardownEach( eachBlock1_iterations, true, eachBlock1_value.length );
			
			eachBlock1_iterations.length = eachBlock1_value.length;
		},
		
		teardown: function ( detach ) {
			teardownEach( eachBlock1_iterations, false );
			
			if ( detach ) {
				detachNode( tr );
			}
		}
	};
}

function renderEachBlock1 ( root, eachBlock_value, db, db__index, eachBlock1_value, query, query__index, component ) {
	var td = createElement( 'td' );
	td.className = "Query " + ( root.elapsedClassName );
	
	var text = createText( query.formatElapsed );
	appendNode( text, td );
	appendNode( createText( "\n          " ), td );
	
	var div = createElement( 'div' );
	div.className = "popover left";
	
	appendNode( div, td );
	
	var div1 = createElement( 'div' );
	div1.className = "popover-content";
	
	appendNode( div1, div );
	var text2 = createText( query.query );
	appendNode( text2, div1 );
	appendNode( createText( "\n            " ), div );
	
	var div2 = createElement( 'div' );
	div2.className = "arrow";
	
	appendNode( div2, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( td, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, db, db__index, eachBlock1_value, query, query__index ) {
			td.className = "Query " + ( root.elapsedClassName );
			
			text.data = query.formatElapsed;
			
			text2.data = query.query;
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( td );
			}
		}
	};
}

function Table ( options ) {
	options = options || {};
	
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root;
	this._yield = options._yield;

	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Table.prototype.get = get;
Table.prototype.fire = fire;
Table.prototype.observe = observe;
Table.prototype.on = on;

Table.prototype.set = function set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Table.prototype.teardown = function teardown ( detach ) {
	this.fire( 'teardown' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
};

perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
perfMonitor.initProfiler('view update');

const table = new Table({
	target: document.querySelector( '#body' ),
	data: {
		dbs: ENV.generateData().toArray()
	}
});

function redraw() {
	perfMonitor.startProfile('view update');
	table.set({ dbs: ENV.generateData().toArray() });
	perfMonitor.endProfile('view update');
	setTimeout(redraw, ENV.timeout);
}

redraw();
//# sourceMappingURL=bundle.js.map
