// Hello Element
(function(){
    $(document).ready(function() {
        // We need to get the shared store and tell it how it should
        // notify us when mutations to the state have occurred.
        plux.subscribe("shared", function(state){
            updateValues(state.count);
        });
        // We need to do this to initialize the view, and update it.
        function updateValues(count){
            $("#incCount").text(count);
        }
        // Let's wire up the button to trigger an action to the dispatcher.
        $("#inc button").click(function(){
            actions.increment();
        });
    });
})();

// World Element
(function(){
    $(document).ready(function() {
        // We need to get the shared store and tell it how it should
        // notify us when mutations to the state have occurred.
        // This is the same store as used by the hello element.
        plux.subscribe("shared", function(state){
            updateValues(state.count);
        });
        // We need to do this to initialize the view, and update it.
        function updateValues(count){
            $("#decCount").text(count);
        }
        // Let's wire up the button to trigger an action to the dispatcher.
        $("#dec button").click(function(){
            actions.decrement();
        });
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
