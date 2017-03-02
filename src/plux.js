// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
var plux = (function(){
    var stores = []; // Contains references to all stores.
    var noop = function(){};
    var dispatch = function(action, data){
        // Iterate through all registered stores to dispatch the action.
        for(storeID in stores){
            var store = stores[storeID];
            // Handle the action and trigger any mutations.
            store.handleAction(
                action, 
                data, 
                store.state
            );
            store.notify(store.subscriptions);
        };
    }
    var API = {
        // Register a store with plux to receive actions and manage state.
        'createStore': function(name, actionHandler, initial){
            stores[name] = stores[name] || {
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
        'subscribe': function(storeName, subscriber){
            stores[storeName].subscriptions.push(subscriber);
            return stores[storeName].subscriptions.length;
        },
        // Subscribe to listen to any changes that affect a view.
        'unsubscribe': function(storeName, id){
            stores[storeName].subscriptions[id] = noop;
        },
        // Register an action that's available for views to trigger.
        'createAction': function(name){
            // returns callable function that is detacted from Plux API.
            return (function(data){
                return dispatch(name, data);
            });
        },
        // Allow retrieval of state of specified store
        'getState': function(name){
            return Object.assign({}, (stores[name] ? stores[name].state : {}));
        }
    }
    return API;
})();
