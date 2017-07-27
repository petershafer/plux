(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
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

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var plux = function () {
    var stores = []; // Contains references to all stores.
    var subscriptionCounters = []; // Tracks IDs to assign to subscribers
    var dispatch = function dispatch(action, data) {
      var _loop = function _loop(storeID) {
        var store = stores[storeID];
        // Collect events
        var events = new Set();
        var change = function change() {
          var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "change";
          return events.add(event);
        };
        // Handle the action and trigger any mutations.
        store.handleAction(action, data, store.state, change);
        events.add("change");
        events.forEach(function (event) {
          return store.notify(store.subscriptions, event);
        });
      };

      // Iterate through all registered stores to dispatch the action.
      for (var storeID in stores) {
        _loop(storeID);
      };
    };
    var _unsubscribe = function _unsubscribe(storeName, id) {
      var subscriptionIndex = stores[storeName].subscriptions.findIndex(function (entry) {
        return entry[0] == id;
      });
      if (subscriptionIndex >= 0) {
        stores[storeName].subscriptions.splice(subscriptionIndex, 1);
      }
    };
    var API = {
      // Register a store with plux to receive actions and manage state.
      'createStore': function createStore(name, actionHandler, initial) {
        stores[name] = stores[name] || {
          'state': initial || {},
          'handleAction': actionHandler,
          'subscriptions': [],
          'getters': {},
          'notify': function notify(subscriptions, event) {
            var _this = this;

            this.subscriptions.filter(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 3),
                  subEvent = _ref2[2];

              return event === subEvent || subEvent === "_all";
            }).forEach(function (subscription) {
              return subscription[1](Object.assign({}, _this.state), event);
            });
          }
        };
        var plux = this;
        return {
          'name': name,
          'subscribe': function subscribe(subscriber) {
            var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "change";
            return plux.subscribe(name, subscriber, event);
          },
          'listen': function listen(event, subscriber) {
            return plux.listen(name, event, subscriber);
          },
          'get': function get(getter) {
            if (!getter) {
              return Object.assign({}, stores[name].state);
            }
            return stores[name].getters[getter] ? stores[name].getters[getter](stores[name].state) : null;
          },
          'createGetter': function createGetter(getterName, getterFunction) {
            return stores[name].getters[getterName] = getterFunction;
          },
          'once': function once(event, callback) {
            return plux.once(name, event, callback);
          }
        };
      },
      // Subscribe to listen to any changes that affect a view. Optionally specify an event to filter by.
      'subscribe': function subscribe(storeName, subscriber) {
        var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "change";

        subscriptionCounters[storeName] = subscriptionCounters[storeName] || 0;
        var subid = subscriptionCounters[storeName]++;
        stores[storeName].subscriptions.push([subid, subscriber, event]);
        return {
          "unsubscribe": function unsubscribe() {
            return _unsubscribe(storeName, subid);
          },
          "id": subid,
          "store": storeName
        };
      },
      // Listen is almost the same as subscribe, but it emphasizes an event you want to listen for, rather than a store you want to subscribe to.
      'listen': function listen(storeName, event, listener) {
        return this.subscribe(storeName, listener, event);
      },
      'once': function once(storeName, event, callback) {
        var listener = this.listen(storeName, event, function (state, event) {
          callback(state, event);
          listener.unsubscribe();
        });
        return { 'cancel': function cancel() {
            return listener.unsubscribe();
          } };
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