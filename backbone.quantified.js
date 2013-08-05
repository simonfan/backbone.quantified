define(['backbone'], function(Backbone) {

	/**
	 * QuantifiedModel is used by QuantifiedCollection
	 * may be a separate component some day.. but for now leave it as it is.
	 */
	var QuantifiedModel = Backbone.Model.extend({
		defaults: {
			quantity: 0,
		},

		increase: function(quantity) {
				// defaults to increase one unit
			var increase = typeof quantity !== 'undefined' ? quantity : 1;

			return this.__crease(increase);
		},

		decrease: function(quantity) {
				// defaults to remove one unit
			var decrease = typeof quantity !== 'undefined' ? -1 * quantity : -1;

			return this.__crease(decrease);
		},

		__crease: function(quantity) {
			quantity = this.get('quantity') + quantity;

			this.set('quantity', quantity);

			return this;
		},

		quantity: function(quantity) {
			return this.get('quantity');
		}
	});



	/**
	 * QuantifiedCollection has two very special methods: 
	 * 	increase
	 *	decrease
	 */
	var QuantifiedCollection = Backbone.Collection.extend({
		initialize: function(models, options) {
			options = options || {};

			_.bindAll(this, 'increase','decrease','add','remove');
		},

		/**
		 * The QuantifiedModel model is used to handle increase and decrease quantities
		 */
		model: QuantifiedModel,

		/**
		 * Adds a item to the collection based on the given model.
		 */
		increase: function(model, quantity) {

			if (_.isArray(model)) {

				var _this = this;

				_.each(model, function(model) {
					_this.increase(model, quantity);
				});

			} else {

					// 1: get the model from the collection.
					// model must have an id property!
				var id = typeof model === 'object' ? model.id : model,
					quantifiedItem = this.get(id);

				if (!quantifiedItem) {
					// the item does not exist in the collection
					// create it

					var quantifiedItemAttr = _.clone(model.attributes);
					this.add(quantifiedItemAttr);

					// get the quantifiedItem again
					quantifiedItem = this.get(id);
				}

				// the item is already in the collection, just increase its quantity
				quantifiedItem.increase(quantity);

				/**
				 * Trigger an 'increase' event and pass the quantifiedItem model
				 * and the quantity
				 */
				this.trigger('increase', quantifiedItem, quantifiedItem.quantity());
			}

			return this;
		},

		/**
		 * Removes item instances from the collection based on given model.
		 */
		decrease: function(model, quantity) {

			if (_.isArray(model)) {

				var _this = this;
				_.each(model, function(model) {
					return _this.decrease(model, quantity);
				});
			} else {

				var id = typeof model === 'object' ? model.id : model,
					quantifiedItem = this.get(id);

				// ignore the request if the item is not in the collection.
				if (!quantifiedItem) {
					return this;
				}

				// decrease the quantity from the item in the collection.
				// if the quantity reaches to 0, the model will 'destroy' itself
				// which will remove it from this collection. 
				// But the reference to the model will remain, so we may get 
				// the quantity a lasttime.
				quantifiedItem.decrease(quantity);

				// check quantity
				if (quantifiedItem.quantity() === 0) {
					this.remove(quantifiedItem);
				}

				// trigger 'remove-item'
				this.trigger('decrease', quantifiedItem, quantifiedItem.quantity());
			}

			return this;
		},

		/**
		 * Checks how many models of the given model are in.
		 */
		quantity: function(model) {
			var id = typeof model === 'object' ? model.id : model;
			return this.get(id).quantity();
		},
	});
	
	return {
		Model: QuantifiedModel,
		Collection: QuantifiedCollection
	};
});