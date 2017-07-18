"use strict";
// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
const plux = (() => {
  const stores = []; // Contains references to all stores.
  const subscriptionCounters = []; // Tracks IDs to assign to subscribers
  const dispatch = (action, data) => {
    // Iterate through all registered stores to dispatch the action.
    for(let storeID in stores){
      let store = stores[storeID];
      // Handle the action and trigger any mutations.
      store.handleAction(
        action, 
        data, 
        store.state
      );
      store.notify(store.subscriptions);
    };
  };
  const unsubscribe = (storeName, id) => {
    let subscriptionIndex = stores[storeName].subscriptions.findIndex((entry) => entry[0] == id);
    stores[storeName].subscriptions.splice(subscriptionIndex, 1);
  };
  const API = {
    // Register a store with plux to receive actions and manage state.
    'createStore': (name, actionHandler, initial) => {
      stores[name] = stores[name] || {
        'state': initial || {},
        'handleAction': actionHandler,
        'subscriptions': [],
        'notify': function(subscriptions){
          this.subscriptions.forEach((subscription) => {
            const filter = subscription[2];
            const results = filter ? filter(this.state) : this.state;
            if(results !== false){
              subscription[1](Object.assign({}, results));
            }
          });
        }
      };
    },
    // Subscribe to listen to any changes that affect a view.
    'subscribe': (storeName, subscriber, filter) => {
      subscriptionCounters[storeName] = subscriptionCounters[storeName] || 0
      const subid = subscriptionCounters[storeName]++;
      stores[storeName].subscriptions.push([subid, subscriber, filter]);
      return {
        "unsubscribe": () => unsubscribe(storeName, subid),
        "id": subid,
        "store": storeName
      }
    },
    // Runs callback function if state meets specified filter function criteria, or
    // subscribes to the store and waits for filter function to be met and unsubscribes.
    'once': (storeName, callback, condition) => {
      const state = plux.getState(storeName);
      // TODO: Eliminate redundant code between once and dispatch.
      const result = condition(state);
      if(result !== false){
        callback(result);
        return {
          "unsubscribe": () => null,
          "id": null,
          "store": storeName
        }
      }else{
        const subscription = plux.subscribe(storeName, (state) => {
          callback(state);
          subscription.unsubscribe();
        }, condition);
        return subscription;
      }
    },
    // Register an action that's available for views to trigger.
    'createAction': (name) => (data) => dispatch(name, data),
    // Allow retrieval of state of specified store
    'getState': (name) => Object.assign({}, (stores[name] ? stores[name].state : {}))
  }
  return API;
})();

module.exports = plux;
