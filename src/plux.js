// Based on description here:
// https://github.com/facebook/flux/tree/master/examples/flux-concepts
var plux = (function(){
	var stores = [];
	var dispatch = function(action, data){
			for(store in stores){
				stores[store].manager(
					action, 
					data, 
					function(){ stores[store].notify(stores[store].subscriptions) }, 
					stores[store].state
				);
			};
		}
	var API = {
		'createStore': function(name, manager, initial){
			stores[name] = {
				'state': initial || {},
				'manager': manager,
				'notify': function(subscriptions){
					this.subscriptions.forEach(function(subscription){
						subscription();
					});
				},
				'subscriptions': []
			};
		},
		'dispatch': function(action, data){
			for(store in stores){
				stores[store].manager(
					action, 
					data, 
					function(){ stores[store].notify(stores[store].subscriptions) }, 
					stores[store].state
				);
			};
		},
		'getStore': function(storeName, subscriber){
			stores[storeName].subscriptions.push(subscriber);
			return stores[storeName].state;
		},
		'registerAction': function(name){
			// returns callable function
			return (function(){
				dispatch(name);
			}).bind(this);
		}
	}
	return API;
})();
