// A sample actions file.
var actions = (function(){
    var API = {
        'initialize': plux.registerAction("initialize"),
        'helloAction': plux.registerAction("hello"),
        'worldAction': plux.registerAction("world"),
        'getCount': plux.registerAction("getCount")
    };
    return API;
})();
