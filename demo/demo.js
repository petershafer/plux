// App Setup
(function(){
	$(document).ready(function() {
		actions.initialize();
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


// Reset Element
(function(){
	$(document).ready(function() {
    	// Let's wire up the button to trigger an action to the dispatcher.
	    $("#reset").click(function(){
	    	actions.initialize();
	    });
	});
})();
