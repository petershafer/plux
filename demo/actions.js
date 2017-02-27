// A sample actions file.
var actions = (function(){
    var API = {
        'initialize': plux.createAction("initialize"),
        'increment': plux.createAction("increment"),
        'decrement': plux.createAction("decrement"),
        'getCount': plux.createAction("getCount")
    };
    return API;
})();
