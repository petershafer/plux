// A sample store file.
(function(){
    var myActionHandler = function(action, data, state){
        switch(action){
            case "initialize":
                state.count = 0;
                break;
            case "increment":
                state.count++;
                break;
            case "decrement":
                state.count--;
                break;
        }
    };
    plux.createStore("shared", myActionHandler, { 'count': 0 });    
})();
