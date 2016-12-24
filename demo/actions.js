// A sample actions file.
var actions = (function(){
    var API = {
        'initialize': plux.registerAction("initialize"),
        'increment': plux.registerAction("increment"),
        'decrement': plux.registerAction("decrement"),
        'getCount': plux.registerAction("getCount")
    };
    return API;
})();
