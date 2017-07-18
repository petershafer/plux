'use strict';

var expect = require('chai').expect;
var plux = require('../src/plux');


describe(`Plux API`, function() {
  it('should have four primary API methods', function() {
    expect(plux).to.have.a.property('createStore');
    expect(plux.createStore).to.be.a("function");
    expect(plux).to.have.a.property('subscribe');
    expect(plux.subscribe).to.be.a("function");
    expect(plux).to.have.a.property('createAction');
    expect(plux.createAction).to.be.a("function");
    expect(plux).to.have.a.property('getState');
    expect(plux.getState).to.be.a("function");
  });
});

describe(`createStore`, function() {
  it('should accept an action handler that is called for every action', function() {
    let handlerCalled = false;
    let actionHandler = (action, data, state) => {
        switch(action){
            case "anAction":
                handlerCalled = true;
                break;
        }
    };
    plux.createStore("test-1", actionHandler, { 'actionTaken': false }); 
    plux.createAction("anAction")();
    expect(handlerCalled).to.be.true;
  });

  it('should allow for subscriptions to the new store', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
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

  it('should allow for state retrieval for the new store', function() {
    let subscriptionCalled = false;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
              state.hello = data;
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

});

describe(`subscribe`, function() {
  it('should return an API with two properties and a method', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
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
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
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

  it('should accept a filter function that is called before the subscriber function', function() {
    let callCount = 0;
    let subscriptionLastCall = null;
    let filterLastCall = null;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
                break;
        }
    };
    plux.createStore("test-0716-1", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-0716-1", (state) => subscriptionLastCall = callCount++, (state) => { filterLastCall = callCount++; return state; });
    anAction();
    expect(filterLastCall).to.be.equal(0);
    expect(subscriptionLastCall).to.be.equal(1);
  });

  it('should only call the subscriber function if the filter function returns a non-false value', function() {
    let subscriberCalls = 0;
    let filterCalls = 0;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
                break;
        }
    };
    plux.createStore("test-0716-2", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    plux.subscribe("test-0716-2", (state) => subscriberCalls++, (state) => ++filterCalls % 2 == 0 ? state : false );
    anAction();
    expect(filterCalls).to.be.equal(1);
    expect(subscriberCalls).to.be.equal(0);
    anAction();
    expect(filterCalls).to.be.equal(2);
    expect(subscriberCalls).to.be.equal(1);
  });

  it('should call the subscriber with the value returned by the filter function', function() {
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
                break;
        }
    };
    plux.createStore("test-0716-3", actionHandler, { }); 
    let anAction = plux.createAction("anAction");
    const subscription = plux.subscribe("test-0716-3", (state) => expect(state.answer).to.be.equal(42), (state) => { return { 'answer': 42 } } );
    anAction();
    subscription.unsubscribe();
  });

  it('should stop sending state updates to callback after unsubscribe is called', function() {
    let subscriptionCalled = 0;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
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

});

describe(`once`, function() {
  it('should accept a callback function and a filter function', function() {
    expect(true).to.be.false;
  });
  it('should only ever execute the callback function once', function() {
    expect(true).to.be.false;
  });
  it('should execute the callback function immediately if state meets filter criteria', function() {
    expect(true).to.be.false;
  });
  it('should execute the callback function later uf the state does not meet the filter criteria', function() {
    expect(true).to.be.false;
  });
});

describe(`createAction`, function() {
  it('should return a callable method that invokes the given action against all stores with specified data', function() {
    let subscriptionCalled = false;
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
              state.hello = data;
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
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
              state.hello = data;
                break;
        }
    };
    plux.createStore("test-8", actionHandler, { }); 
    let currentState = plux.getState("test-8");
    expect(currentState).to.be.ok;
    expect(currentState).to.be.a('object');
  });
});
