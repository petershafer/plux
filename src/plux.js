var plux = (function(){
	var stores = [];
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
		}
	}
	return API;
})();