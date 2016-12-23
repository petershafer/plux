// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
var plux = (function(){
    var stores = []; // Contains references to all stores.
    var dispatch = function(action, data){
        var responses = []; // in case multiple stores respond.
        var i = 0; // count the number of responses.
        var lastResponse; // reference to last response in case it's just one.
        // Iterate through all registered stores to dispatch the action.
        for(storeID in stores){
            var store = stores[storeID];
            // Handle the action and trigger any mutations.
            var response = store.handleAction(
                action, 
                data, 
                function(){ store.notify(store.subscriptions) }, 
                store.state
            );
            // Determine if there's any response and store it.
            if(response || response === 0){
                responses[storeID] = response;
                lastResponse = response;
                i++;
            }
        };
        // Tailor the return value based on the number of responses.
        if(i == 1){
            return lastResponse;
        }else if(i == 0){
            return null;
        }else{
            return responses;
        }
    }
    var API = {
        // Register a store with plux to receive actions and manage state.
        'createStore': function(name, actionHandler, initial){
            stores[name] = {
                'state': initial || {},
                'handleAction': actionHandler,
                'notify': function(subscriptions){
                    this.subscriptions.forEach(function(subscription){
                        subscription();
                    });
                },
                'subscriptions': []
            };
        },
        // Subscribe to listen to any changes that affect a view.
        'registerView': function(storeName, subscriber){
            stores[storeName].subscriptions.push(subscriber);
        },
        // Register an action that's available for views to trigger.
        'registerAction': function(name){
            // returns callable function
            return (function(data){
                return dispatch(name, data);
            }).bind(this);
        }
    }
    return API;
})();
