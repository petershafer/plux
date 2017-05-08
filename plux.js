(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.plux = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
var plux = (function(){
    var stores = []; // Contains references to all stores.
    var noop = function(){};
    var dispatch = function(action, data){
        // Iterate through all registered stores to dispatch the action.
        for(var storeID in stores){
            var store = stores[storeID];
            // Handle the action and trigger any mutations.
            store.handleAction(
                action, 
                data, 
                store.state
            );
            store.notify(store.subscriptions);
        };
    };
    var unsubscribe = function(storeName, id){
        stores[storeName].subscriptions[id] = noop;
    };
    var API = {
        // Register a store with plux to receive actions and manage state.
        'createStore': function(name, actionHandler, initial){
            stores[name] = stores[name] || {
                'state': initial || {},
                'handleAction': actionHandler,
                'notify': function(subscriptions){
                    var store = this;
                    this.subscriptions.forEach(function(subscription){
                        subscription(Object.assign({}, store.state));
                    });
                },
                'subscriptions': []
            };
        },
        // Subscribe to listen to any changes that affect a view.
        'subscribe': function(storeName, subscriber){
            var subid = stores[storeName].subscriptions.length;
            stores[storeName].subscriptions.push(subscriber);
            subscriber(stores[storeName].state);
            return {
                "unsubscribe": (function(){
                    unsubscribe(storeName, subid);
                }),
                "id": subid,
                "store": storeName
            }
            ;
        },
        // Register an action that's available for views to trigger.
        'createAction': function(name){
            // returns callable function that is detached from Plux API.
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

module.exports = plux;

},{}]},{},[1])(1)
});