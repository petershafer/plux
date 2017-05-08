"use strict";
// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
const plux = (() => {
  const stores = []; // Contains references to all stores.
  const noop = () => {};
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
  const unsubscribe = (storeName, id) => stores[storeName].subscriptions[id] = noop;
  const API = {
    // Register a store with plux to receive actions and manage state.
    'createStore': (name, actionHandler, initial) => {
      stores[name] = stores[name] || {
        'state': initial || {},
        'handleAction': actionHandler,
        'subscriptions': [],
        'notify': function(subscriptions){
          this.subscriptions.forEach((subscription) => subscription(Object.assign({}, this.state)));
        }
      };
    },
    // Subscribe to listen to any changes that affect a view.
    'subscribe': (storeName, subscriber) => {
      const subid = stores[storeName].subscriptions.length;
      stores[storeName].subscriptions.push(subscriber);
      subscriber(stores[storeName].state);
      return {
        "unsubscribe": () => unsubscribe(storeName, subid),
        "id": subid,
        "store": storeName
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
