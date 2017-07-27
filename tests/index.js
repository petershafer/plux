'use strict';

var expect = require('chai').expect;
var plux = require('../src/plux');

var i = 0;
function generateName(){
    return `store${i++}`;
}

describe(`Plux API`, function() {
  it('should have five primary API methods', function() {
    expect(plux).to.have.a.property('createStore');
    expect(plux.createStore).to.be.a("function");
    expect(plux).to.have.a.property('subscribe');
    expect(plux.subscribe).to.be.a("function");
    expect(plux).to.have.a.property('createAction');
    expect(plux.createAction).to.be.a("function");
    expect(plux).to.have.a.property('getState');
    expect(plux.getState).to.be.a("function");
    expect(plux).to.have.a.property('listen');
    expect(plux.getState).to.be.a("function");
  });
});

describe(`createStore`, function() {
  it('should return an API with 5 properties/methods and the name should match what was submitted', function() {
    let actionHandler = (action, data, state, event) => {
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    let sharedStore = plux.createStore("test-0727-5", actionHandler, {}); 
    expect(sharedStore).to.have.a.property('name');
    expect(sharedStore.name).to.be.a("string");
    expect(sharedStore.name).to.equal("test-0727-5");
    expect(sharedStore).to.have.a.property('subscribe');
    expect(sharedStore.subscribe).to.be.a("function");
    expect(sharedStore).to.have.a.property('listen');
    expect(sharedStore.listen).to.be.a("function");
    expect(sharedStore).to.have.a.property('get');
    expect(sharedStore.get).to.be.a("function");
    expect(sharedStore).to.have.a.property('createGetter');
    expect(sharedStore.createGetter).to.be.a("function");
  });

  it('should accept an action handler that is called for every action', function() {
    let handlerCalled = false;
    let actionHandler = (action, data, state, event) => {
        switch(action){
            case "anAction":
                handlerCalled = true;
                event();
                break;
        }
    };
    plux.createStore("test-1", actionHandler, { 'actionTaken': false }); 
    plux.createAction("anAction")();
    expect(handlerCalled).to.be.true;
  });

  it('should allow for subscriptions to the new store, via plux', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    plux.createStore("test-2", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-2", (state) => subscriptionCalled++);
    expect(subscriptionCalled).to.be.equal(0);
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
  });

  it('should allow for subscriptions to the new store, via the store itself', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    let sharedStore = plux.createStore("test-0727-4", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    sharedStore.subscribe((state) => subscriptionCalled++);
    expect(subscriptionCalled).to.be.equal(0);
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
  });

  it('should allow for state retrieval for the new store, via plux', function() {
    let subscriptionCalled = false;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
              state.hello = data;
                event();
                break;
        }
    };
    plux.createStore("test-3", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    anAction("world");
    let currentState = plux.getState("test-3");
    expect(currentState).to.be.ok;
    expect(currentState).to.have.property('hello');
    expect(currentState.hello).to.be.equal("world");
  });

  it('should return an object that includes a get function that returns the state if no arguments are included', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    let sharedStore = plux.createStore("test-0727-6", actionHandler, { 'hello': 'world' }); 
    let myState = sharedStore.get();
    expect(myState.hello).to.be.equal('world');
  });

  it('should return an object that includes a createGetter function that creates new getters on the store', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    let sharedStore = plux.createStore("test-0727-7", actionHandler, { 'hello': 'world' }); 
    sharedStore.createGetter("test", (state) => state.hello);
    let myValue = sharedStore.get("test");
    expect(myValue).to.be.equal('world');
  });

});

describe(`subscribe`, function() {
  it('should return an API with two properties and a method', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    plux.createStore("test-4", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    let subscription = plux.subscribe("test-4", (state) => subscriptionCalled++);
    expect(subscription).to.have.a.property('unsubscribe');
    expect(subscription.unsubscribe).to.be.a("function");
    expect(subscription).to.have.a.property('id');
    expect(subscription.id).to.be.a("number");
    expect(subscription).to.have.a.property('store');
    expect(subscription.store).to.be.a("string");
  });

  it('should accept a callback function that receives all state updates', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    plux.createStore("test-5", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-5", (state) => subscriptionCalled++);
    expect(subscriptionCalled).to.be.equal(0);
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
  });

  it('should stop sending state updates to callback after unsubscribe is called', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event();
                break;
        }
    };
    plux.createStore("test-6", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    let subscription = plux.subscribe("test-6", (state) => subscriptionCalled++);
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
    subscription.unsubscribe();
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
  });

  it('should allow you to subscribe to listen only for specific events', function() {
    let subscriptionCalledA = 0;
    let subscriptionCalledB = 0;
    let altSubscriptionCalledA = 0;
    let altSubscriptionCalledB = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event("hello");
                event("world");
                break;
        }
    };
    plux.createStore("test-0727-1", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-0727-1", (state) => subscriptionCalledA++, "hello");
    plux.subscribe("test-0727-1", (state) => subscriptionCalledB++, "world");
    plux.listen("test-0727-1", "hello", (state) => altSubscriptionCalledA++);
    plux.listen("test-0727-1", "world", (state) => altSubscriptionCalledB++);
    anAction();
    // via plux.subscribe
    expect(subscriptionCalledA).to.be.equal(1);
    expect(subscriptionCalledB).to.be.equal(1);
    // via plux.listen
    expect(altSubscriptionCalledA).to.be.equal(1);
    expect(altSubscriptionCalledB).to.be.equal(1);
  });

  it('should ensure that a change event always fires if a custom event fires', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event("hello");
                break;
        }
    };
    plux.createStore("test-0727-2", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-0727-2", (state) => subscriptionCalled++, "change");
    anAction();
    expect(subscriptionCalled).to.be.equal(1);
  });

  it('should allow you to subscribe to all events', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
                event("hello");
                event("world");
                break;
        }
    };
    plux.createStore("test-0727-3", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-0727-3", (state) => subscriptionCalled++, "_all");
    anAction();
    expect(subscriptionCalled).to.be.equal(3);
  });

});

describe(`createAction`, function() {
  it('should return a callable method that invokes the given action against all stores with specified data', function() {
    let subscriptionCalled = false;
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
              state.hello = data;
                event();
                break;
        }
    };
    plux.createStore("test-7", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    expect(anAction).to.be.a("function");
    anAction("world");
    let currentState = plux.getState("test-7");
    expect(currentState).to.be.ok;
    expect(currentState).to.have.property('hello');
    expect(currentState.hello).to.be.equal("world");

  });
});

describe(`getState`, function() {
  it('should return an object representative of the state held by the specified store', function() {
    let actionHandler = function(action, data, state, event){
        switch(action){
            case "anAction":
              state.hello = data;
                event();
                break;
        }
    };
    plux.createStore("test-8", actionHandler, { }); 
    let currentState = plux.getState("test-8");
    expect(currentState).to.be.ok;
    expect(currentState).to.be.a('object');
  });
});
