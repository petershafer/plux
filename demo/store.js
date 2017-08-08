// A sample store file.
(function(){
    var myActionHandler = function(action, data, state, event){
        switch(action){
            case "initialize":
                state.count = 0;
                event("initialized");
                break;
            case "increment":
                state.count++;
                event("incremented");
                break;
            case "decrement":
                state.count--;
                event("decremented");
                break;
        }
    };
    plux.createStore("shared", myActionHandler, { 'count': 0 });    
})();
