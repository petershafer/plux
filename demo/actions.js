// Our plux actions
var actions = (function(){
	var API = {
    	'initialize': plux.registerAction("initialize"),
    	'helloAction': plux.registerAction("hello"),
    	'worldAction': plux.registerAction("world")
    };
    return API;
})();
