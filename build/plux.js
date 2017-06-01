(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.plux = mod.exports;
  }
})(this, function (module) {
  "use strict";
  // Based on description here:
  // https://github.com/facebook/flux/tree/master/examples/flux-concepts

  var plux = function () {
    var stores = []; // Contains references to all stores.
    var subscriptionCounters = []; // Tracks IDs to assign to subscribers
    var dispatch = function dispatch(action, data) {
      // Iterate through all registered stores to dispatch the action.
      for (var storeID in stores) {
        var store = stores[storeID];
        // Handle the action and trigger any mutations.
        store.handleAction(action, data, store.state);
        store.notify(store.subscriptions);
      };
    };
    var _unsubscribe = function _unsubscribe(storeName, id) {
      var subscriptionIndex = stores[storeName].subscriptions.findIndex(function (entry) {
        return entry[0] == id;
      });
      stores[storeName].subscriptions.splice(subscriptionIndex, 1);
    };
    var API = {
      // Register a store with plux to receive actions and manage state.
      'createStore': function createStore(name, actionHandler, initial) {
        stores[name] = stores[name] || {
          'state': initial || {},
          'handleAction': actionHandler,
          'subscriptions': [],
          'notify': function notify(subscriptions) {
            var _this = this;

            this.subscriptions.forEach(function (subscription) {
              return subscription[1](Object.assign({}, _this.state));
            });
          }
        };
      },
      // Subscribe to listen to any changes that affect a view.
      'subscribe': function subscribe(storeName, subscriber) {
        subscriptionCounters[storeName] = subscriptionCounters[storeName] || 0;
        var subid = subscriptionCounters[storeName]++;
        stores[storeName].subscriptions.push([subid, subscriber]);
        subscriber(stores[storeName].state);
        return {
          "unsubscribe": function unsubscribe() {
            return _unsubscribe(storeName, subid);
          },
          "id": subid,
          "store": storeName
        };
      },
      // Register an action that's available for views to trigger.
      'createAction': function createAction(name) {
        return function (data) {
          return dispatch(name, data);
        };
      },
      // Allow retrieval of state of specified store
      'getState': function getState(name) {
        return Object.assign({}, stores[name] ? stores[name].state : {});
      }
    };
    return API;
  }();

  module.exports = plux;
});