// App Setup
(function(){
	$(document).ready(function() {
		// You'll need the action manager for the store to accept four arguments.
		// action: a string representing the action that has been dispatched to the store.
		// data: data associated with the action being dispatched.
		// notify: a function that must be called if the state is mutated.
		// state: the data in the store that can be mutated.
		var myManager = function(action, data, notify, state){
			console.log("Handling action name: " + action);
	    	switch(action){
	    		case "hello":
	    			state.count++;
	    			notify(); // state has been mutated, alert the views!
	    			break;
	    		case "world":
	    			state.count--;
	    			notify(); // state has been mutated, alert the views!
	    			break;
	    	}
	    };
	    var initialState = { 'count': 0 }
	    plux.createStore("shared", myManager, initialState);
	});
})();

// Hello Element
(function(){
	$(document).ready(function() {
		// We need to get the shared store and tell it how it should
		// notify us when mutations to the state have occurred.
    	var sharedStore = plux.getStore("shared", function(){
    		updateValues();
    	});
    	// We need to do this to initialize the view, and update it.
    	function updateValues(){
    		console.log("Updating values for HELLO element");
    		$("#helloCount").text(sharedStore.count);
    	}
    	// Let's wire up the button to trigger an action to the dispatcher.
	    $("#hello button").click(function(){
	    	actions.helloAction();
	    });
	    // Initialize the view.
	    updateValues();
	});
})();

// World Element
(function(){
	$(document).ready(function() {
		// We need to get the shared store and tell it how it should
		// notify us when mutations to the state have occurred.
		// This is the same store as used by the hello element.
    	var sharedStore = plux.getStore("shared", function(){
    		updateValues();
    	});
    	// We need to do this to initialize the view, and update it.
    	function updateValues(){
    		console.log("Updating values for WORLD element");
    		$("#worldCount").text(sharedStore.count);
    	}
    	// Let's wire up the button to trigger an action to the dispatcher.
	    $("#world button").click(function(){
	    	actions.worldAction();
	    });
	    // Initialize the view.
	    updateValues();
	});
})();
