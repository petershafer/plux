// A sample store file.
(function(){
    var myActionHandler = function(action, data, notify, state){
        switch(action){
            case "initialize":
                state.count = 0;
                notify(); // state has been mutated, alert the views!
                return;
            case "getCount":
                return state.count;
            case "hello":
                state.count++;
                notify(); // state has been mutated, alert the views!
                return;
            case "world":
                state.count--;
                notify(); // state has been mutated, alert the views!
                return;
        }
    };
    plux.createStore("shared", myActionHandler, { 'count': 0 });    
})();
