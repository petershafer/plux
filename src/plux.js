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
      // Collect events
      let events = new Set();
      let change = (event="change") => events.add(event);
      // Handle the action and trigger any mutations.
      store.handleAction(
        action, 
        data, 
        store.state,
        change
      );
      events.add("change");
      events.forEach((event) => store.notify(store.subscriptions, event));
    };
  };
  const unsubscribe = (storeName, id) => {
    let subscriptionIndex = stores[storeName].subscriptions.findIndex((entry) => entry[0] == id);
    if(subscriptionIndex >= 0){
      stores[storeName].subscriptions.splice(subscriptionIndex, 1);
    }
  };
  const API = {
    // Register a store with plux to receive actions and manage state.
    'createStore': function(name, actionHandler, initial){
      stores[name] = stores[name] || {
        'state': initial || {},
        'handleAction': actionHandler,
        'subscriptions': [],
        'getters': {},
        'notify': function(subscriptions, event){
          this.subscriptions.filter(([,,subEvent]) => event === subEvent || subEvent === "_all").forEach((subscription) => subscription[1](Object.assign({}, this.state), event));
        }
      };
      const plux = this;
      return {
        'name': name,
        'subscribe': function(subscriber, event="change"){ return plux.subscribe(name, subscriber, event); },
        'listen': function(event, subscriber){ return plux.listen(name, event, subscriber); },
        'get': (getter) => {
          if(!getter){
            return Object.assign({}, stores[name].state);
          }
          return stores[name].getters[getter] ? stores[name].getters[getter](stores[name].state) : null
        },
        'createGetter': (getterName, getterFunction) => stores[name].getters[getterName] = getterFunction,
      }
    },
    // Subscribe to listen to any changes that affect a view. Optionally specify an event to filter by.
    'subscribe': (storeName, subscriber, event="change") => {
      subscriptionCounters[storeName] = subscriptionCounters[storeName] || 0
      const subid = subscriptionCounters[storeName]++;
      stores[storeName].subscriptions.push([subid, subscriber, event]);
      return {
        "unsubscribe": () => unsubscribe(storeName, subid),
        "id": subid,
        "store": storeName
      }
    },
    // Listen is almost the same as subscribe, but it emphasizes an event you want to listen for, rather than a store you want to subscribe to.
    'listen': function(storeName, event, listener){
      return this.subscribe(storeName, listener, event);
    },
    // Register an action that's available for views to trigger.
    'createAction': (name) => (data) => dispatch(name, data),
    // Allow retrieval of state of specified store
    'getState': (name) => Object.assign({}, (stores[name] ? stores[name].state : {}))
  }
  return API;
})();

module.exports = plux;
