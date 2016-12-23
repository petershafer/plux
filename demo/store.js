// Our plux stores
(function(){
	var myActionHandler = function(action, data, notify, state){
		console.log("Handling action name: " + action);
    	switch(action){
    		case "initialize":
    			state.count = 0;
    			notify(); // state has been mutated, alert the views!
    			break;
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
    plux.createStore("shared", myActionHandler);	
})();
