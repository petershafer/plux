'use strict';

var expect = require('chai').expect;
var plux = require('../src/plux');


describe(`Plux API`, function() {
  it('should have four primary API methods', function() {
    expect(plux).to.have.a.property('createStore');
    expect(typeof plux.createStore).to.be.equal("function");
    expect(plux).to.have.a.property('subscribe');
    expect(typeof plux.createStore).to.be.equal("function");
    expect(plux).to.have.a.property('createAction');
    expect(typeof plux.createStore).to.be.equal("function");
    expect(plux).to.have.a.property('getState');
    expect(typeof plux.createStore).to.be.equal("function");
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
    plux.subscribe("test-2", (state) => {
      subscriptionCalled++;
    });
    expect(subscriptionCalled).to.be.equal(1);
    anAction();
    expect(subscriptionCalled).to.be.equal(2);
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
