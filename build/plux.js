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
        var noop = function noop() {};
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
            stores[storeName].subscriptions[id] = noop;
        };
        var API = {
            // Register a store with plux to receive actions and manage state.
            'createStore': function createStore(name, actionHandler, initial) {
                stores[name] = stores[name] || {
                    'state': initial || {},
                    'handleAction': actionHandler,
                    'notify': function notify(subscriptions) {
                        var store = this;
                        this.subscriptions.forEach(function (subscription) {
                            subscription(Object.assign({}, store.state));
                        });
                    },
                    'subscriptions': []
                };
            },
            // Subscribe to listen to any changes that affect a view.
            'subscribe': function subscribe(storeName, subscriber) {
                var subid = stores[storeName].subscriptions.length;
                stores[storeName].subscriptions.push(subscriber);
                subscriber(stores[storeName].state);
                return {
                    "unsubscribe": function unsubscribe() {
                        _unsubscribe(storeName, subid);
                    },
                    "id": subid,
                    "store": storeName
                };
            },
            // Register an action that's available for views to trigger.
            'createAction': function createAction(name) {
                // returns callable function that is detached from Plux API.
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