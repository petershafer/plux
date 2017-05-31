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
    let actionHandler = function(action, data, state){
        switch(action){
            case "anAction":
                handlerCalled = true;
                break;
        }
    };
    plux.createStore("shared", actionHandler, { 'actionTaken': false }); 
    plux.createAction("anAction")();
    expect(handlerCalled).to.be.true;
  });

  
  
});
