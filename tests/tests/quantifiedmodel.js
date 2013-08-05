define(['backbone.quantified'], function(Quantified) {

return function() {
	
	test('.increase()', function() {
		var model = new Quantified.Model();

		equal(model.get('quantity'), 0);
		equal(model.quantity(), 0);

		// increase 1 by default
		model.increase();

		equal(model.quantity(), 1);

		// increase 5
		model.increase(5);
		equal(model.quantity(), 6);
	});


	test('.decrease()', function() {
		var destroyEvidence = false,
			model = new Quantified.Model({
				quantity: 5
			});

		equal(model.quantity(), 5, 'initial state');

		model.decrease();

		equal(model.quantity(), 4);

		model.decrease(4);

		equal(model.quantity(), 0);

	});

}
});