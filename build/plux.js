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
    var executeNotification = function executeNotification(filter, state, callback) {
      var results = filter ? filter(state) : state;
      if (results !== false) {
        callback(Object.assign({}, results));
      }
      return results;
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
              return executeNotification(subscription[2], _this.state, subscription[1]);
            });
          }
        };
      },
      // Subscribe to listen to any changes that affect a view.
      'subscribe': function subscribe(storeName, subscriber, filter) {
        subscriptionCounters[storeName] = subscriptionCounters[storeName] || 0;
        var subid = subscriptionCounters[storeName]++;
        stores[storeName].subscriptions.push([subid, subscriber, filter]);
        return {
          "unsubscribe": function unsubscribe() {
            return _unsubscribe(storeName, subid);
          },
          "id": subid,
          "store": storeName
        };
      },
      // Runs callback function if state meets specified filter function criteria, or
      // subscribes to the store and waits for filter function to be met and unsubscribes.
      'once': function once(storeName, callback, condition) {
        var result = executeNotification(condition, plux.getState(storeName), callback);
        var options = { 'cancel': function cancel() {
            return null;
          } };
        if (result === false) {
          var subscription = plux.subscribe(storeName, function (state) {
            callback(state);
            subscription.unsubscribe();
          }, condition);
          options.cancel = function () {
            return subscription.unsubscribe();
          };
        }
        return options;
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