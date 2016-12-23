// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
var plux = (function(){
	var stores = [];
	var dispatch = function(action, data){
			for(storeID in stores){
				var store = stores[storeID];
				store.handleAction(
					action, 
					data, 
					function(){ store.notify(store.subscriptions) }, 
					store.state
				);
			};
		}
	var API = {
		'createStore': function(name, actionHandler){
			stores[name] = {
				'state': {},
				'handleAction': actionHandler,
				'notify': function(subscriptions){
					this.subscriptions.forEach(function(subscription){
						subscription();
					});
				},
				'subscriptions': []
			};
		},
		'getStore': function(storeName, subscriber){
			stores[storeName].subscriptions.push(subscriber);
			return stores[storeName].state;
		},
		'registerAction': function(name){
			// returns callable function
			return (function(data){
				dispatch(name, data);
			}).bind(this);
		}
	}
	return API;
})();
