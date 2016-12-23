// App Setup
(function(){
	$(document).ready(function() {
		var myManager = function(action, data, notify, state){
			console.log("Handling action name: " + action);
	    	switch(action){
	    		case "hello":
	    			state.count++;
	    			notify();
	    			break;
	    		case "world":
	    			state.count--;
	    			notify();
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
    	var sharedStore = plux.getStore("shared", function(){
    		updateValues();
    	});
    	function updateValues(){
    		console.log("Updating values for HELLO element");
    		$("#helloCount").text(sharedStore.count);
    	}
	    $("#hello button").click(function(){
	    	plux.dispatch("hello");
	    });
	    updateValues();
	});
})();

// World Element
(function(){
$(document).ready(function() {
    	var sharedStore = plux.getStore("shared", function(){
    		updateValues();
    	});
    	function updateValues(){
    		console.log("Updating values for WORLD element");
    		$("#worldCount").text(sharedStore.count);
    	}
	    $("#world button").click(function(){
	    	plux.dispatch("world");
	    });
	    updateValues();
	});
})();
