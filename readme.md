# Plux is Peter's Flux implementation

If you'd like to try out the demo, follow these steps.

1. npm install
2. npm start
3. open your browser to http://localhost:3000/demo

## What is Plux?

As I've been learning about the [Flux architecture](https://github.com/facebook/flux) I've been trying to build my own proof of concept.  Flux is a pattern for application architectures and there are Flux implementations that are becoming more popular, like [Redux](https://github.com/reactjs/redux).  However, it's not as though Redux is the be-all and end-all of Flux. It requires some very specific trade-offs to be made for it to be properly leveraged. To be able to know whether or not these trade-offs are acceptable, you need to have a solid grasp of vanilla flux. 

So, Plux is my effort at learning how Flux works and the pros and cons of different tradeoffs you can make while using Flux.  Where a framework like Redux will allow you to have perfect playback and capture of an app's state, Plux offers flexibility to gradually ease into the Flux pattern. [You may not need advanced features of Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) but you'll still want the benefits that Flux has to offer.

You can follow the `proof-of-concept` branch to see how Plux is implemented directly in the browser, without any tools or libraries. React is not required, and really it is not a prerequisite for any application using the Flux pattern.

Plux may never be released for general usage, but you can feel free to use the code in your own applications and tweak it to suit your purposes.

**Shout out** to @n1207n for patiently helping me get started with Flux.

# Documentation

 * [Plux API](#plux-api)
   * [createStore](#createstore)
   * [subscribe](#subscribe) 
   * [listen](#listen)
   * [once](#once)
   * [createAction](#createaction)
   * [getState](#getstate)
 * [Store API](#store-api)
   * [name](#name)
   * [subscribe](#subscribe-1)
   * [listen](#listen-1)
   * [get](#get)
   * [createGetter](#creategetter)
   * [once](#once-1)
 * [Subscription/Listener API](#subscriptionlistener-api)
   * [id](#id)
   * [unsubscribe](#unsubscribe)
   * [store](#store)
 * [Once API](#once-api)
   * [cancel](#cancel)

Plux API
========
createStore 
-----------
`plux.createStore(storeName, function, [initialState])`
Creates and registers a store with plux with the given `storeName` that will receive all actions that are executed. The function provided represents the action handler. It receives four arguments when an action is executed. `action`, `data`, `state`, and `event`.
- `action` is a string representation of the action that's been executed and dispatched to the store.
- `data` is argument that was included when the action was executed.
- `state` is the state object associated with the store.
- `event` is a function that must be called when the state has been modified. An optional argument can be provided that specifies a custom event name. By default, the event name is `change`. A `change` event will always be emitted if any event is emitted.

The optional `initialState` argument allows for a provided object to serve as the starting state for a store.
```javascript
let actionHandler = function(action, data, state, event){
    switch(action){
        case "anAction":
            state.count++;
            event();
            break;
    }
};
let sharedStore = plux.createStore("shared", actionHandler, { 'count': 0 }); 
```

subscribe 
---------
`plux.subscribe(storeName, function, [event])`
Creates a subscription to the store with the given `storeName` which executes a given callback function when a change event occurs. If the optional `event` argument is provided, then the callback will be executed only when the given event is emitted from the store. The callback function will include the arguments `state` and `event`.
- `state` represents a shallow copy of the state associated with the store.
- `event` is a string representation of the event that was emitted from the event handler.

The return value of the subscribe function is a subscription object.
```javascript
plux.subscribe("shared", (state) => console.log(`The count is now ${state.count}.`));
```

listen 
------
`plux.listen(storeName, event, function)`
Listen is almost identical to subscribe, but requires that an event be named for the subscription to be listened for. 
```javascript
plux.listen("shared", "incremented", (state) => console.log(`The count has been incremented to ${state.count}.`));
```

once 
----
`plux.once(storeName, event, function)`
Once is almost identical to listen except that it will only execute the callback one time and then unsubscribe from the store. This is meant to be a more convenient way of managing subscriptions that only care about one specific instance of an event, such as when a configuration is loaded. It returns a variable of a subscription object.
```javascript
plux.once("shared", "initialized", (state) => console.log(`The count has been initialized to ${state.count}.`));
```

createAction 
------------
`plux.createAction(actionName)`
createAction will generate a function that will dispatch the `actionName` to all stores. The generated function accepts one optional argument that will be passed as `data` to each store's action handler.
```javascript
let sendMessage = plux.createAction("message");
sendMessage("Hello!");
```

getState 
--------
`plux.getState(storeName)`
getState returns a shallow copy of the current state associated with a name matching `storeName`.
```javascript
plux.getState("shared");
```

Store API
=========
name
----
The string representation of name used to identify the store.

subscribe 
---------
`store.subscribe(function, [event])`
Identical to `plux.subscribe` except that the store's name does not need to be provided.
```javascript
myStore.subscribe((state) => console.log(`The count is now ${state.count}.`));
```

listen 
------
`store.listen(event, function)`
Identical to `plux.listen` except that the store's name does not need to be provided.
```javascript
myStore.listen("incremented", (state) => console.log(`The count has been incremented to ${state.count}.`));
```

get 
---
`store.get([getter])`
If an optional getter is not specified, the current state for the given store will be returned. If the getter is specified, then the store will return data from the state using
the specified getter.
```javascript
myStore.get('count');
```

createGetter 
------------
`store.createGetter(getterName, function)`
Creates a getter on the store with the given name and executes the provided function when the getter is requested. The getter function will be provided with the store's `state`.
```javascript
myStore.createGetter("count", (state) => state.count);
```

once 
----
`store.once(event, function)`
Identical to `plux.once` except that the store's name does not need to be provided.
```javascript
myStore.once("initialized", (state) => console.log(`The count has been initialized to ${state.count}.`));
```

Subscription/Listener API
=========================
id
--
A unique integer used to identify the subscription.

unsubscribe 
-----------
`subscription.unsubscribe()`
Removes the subscription from the store. It will no longer be notified of updates after unsubscribe has been called.

store
-----
The name of the store that the subscription/listener is associated with.

Once API
========
cancel 
------
`subscription.cancel()`
Identical to `subscription.unsubscribe`.

