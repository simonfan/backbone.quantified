define(['backbone.quantified'], function(Quantified) {

return function() {

	module('quantified collection', {
		setup: function() {
			window.fruits = new Backbone.Collection([
				{ id: 1, name: 'banana' },
				{ id: 2, name: 'apple' },
				{ id: 4, name: 'pineapple' },
				{ id: 0, name: 'watermelon' }
			]);
		},
		teardown: function() {
			delete window.fruits;
		}
	})
	
	test('.increase()', function() {
		var collection = new Quantified.Collection(),
			fruits = window.fruits,
			banana = fruits.get(1),
			pineapple = fruits.get(4);


		collection.increase(banana);
		equal(collection.quantity( banana ), 1);

		collection.increase(banana);
		equal(collection.quantity( banana ), 2);

		collection.increase(1, 4);
		equal(collection.quantity( 1 ), 6);

		// bulk increase
		collection.increase([ banana, pineapple ], 7);
		equal(collection.quantity( banana ), 13);
		equal(collection.quantity( pineapple ), 7);
	});


	test('.decrease()', function() {
		var collection = window.collection = new Quantified.Collection(fruits.toJSON());

		collection.increase(collection.models, 10);

		_.each(fruits.models, function(fruit) {
			equal( collection.quantity( fruit ), 10);
		});

		collection.decrease( 4 );

		equal( collection.quantity(4), 9);

		collection.decrease([1,4], 5);

		equal( collection.quantity(1), 5);
		equal( collection.quantity(4), 4);


		collection.decrease(4, 4);
		// expect the 4 to have been removed
		ok( !collection.get(4));
	});

}
});