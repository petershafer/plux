// Hello Element
(function(){
    $(document).ready(function() {
        // We need to get the shared store and tell it how it should
        // notify us when mutations to the state have occurred.
        plux.registerView("shared", function(){
            updateValues();
        });
        // We need to do this to initialize the view, and update it.
        function updateValues(){
            console.log("Updating values for INC element");
            $("#incCount").text(actions.getCount());
        }
        // Let's wire up the button to trigger an action to the dispatcher.
        $("#inc button").click(function(){
            actions.increment();
        });
        // Initialize the view.
        updateValues();
    });
})();

// World Element
(function(){
    $(document).ready(function() {
        // We need to get the shared store and tell it how it should
        // notify us when mutations to the state have occurred.
        // This is the same store as used by the hello element.
        plux.registerView("shared", function(){
            updateValues();
        });
        // We need to do this to initialize the view, and update it.
        function updateValues(){
            console.log("Updating values for DEC element");
            $("#decCount").text(actions.getCount());
        }
        // Let's wire up the button to trigger an action to the dispatcher.
        $("#dec button").click(function(){
            actions.decrement();
        });
        // Initialize the view.
        updateValues();
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
