dojo.require("dojo.fx.easing");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.HorizontalSlider");
dojo.require("my.BallSurface");
dojo.require("my.Chart2D");
dojo.require("my.PlotKit.claro");

dojo.ready(function(){
	// Generate the 'getSeries' function
	var getSeries = (function(end, dataLength){
		// Set up the base data set with as many values
		// as needed
		var baseData = [];
		for(var i=0; i<dataLength; i++){
			baseData.push(i/dataLength);
		}

		// Store caluculated series'
		var series_hash = {},
			easing = dojo.fx.easing;

		// The actual 'getSeries' function
		return function(id){
			// If we've already generated the series, return that
			if(typeof series_hash[id] != 'undefined'){
				return series_hash[id];
			}
			// Map the values in the base data set to 'eased' values
			return series_hash[id] = dojo.map(baseData, function(data){
				var step = easing[id](data);

				return end * step;
			});
		};
	})(800, 2000); // use a data set of 2000 to get a very smooth line

	// Generate labels as multiples of 10 since we're using a
	// data set of 2000
	var xLabels = [];
	for(var i=0; i<11; i++){
		xLabels.push({ value: i*200, text: "" + (i*10) });
	}

	// create the chart
	var chart = new my.Chart2D('easingChart');
	chart.
		setTheme(my.PlotKit.claro).
		addPlot('default', {
			type: 'Areas',
			tension: 2
		}).
		addAxis('x', {
			title: 'Percent Complete',
			minorTicks: false,
			majorTickStep: 200,
			labels: xLabels
		}).
		addAxis('y', {
			title: 'Position (px)',
			minorTicks: false,
			vertical: true,
			majorTickStep: 100
		}).
		addSeries('linear', getSeries('linear')).
		render();

	function addRemoveSeries(checked){
		if(checked){
			// Remove all old series'
			for(var i in chart.runs){
				chart.removeSeries(i);
			}
			// Add the new series and render
			chart.addSeries(this.id, getSeries(this.id)).render();
		}
	}

	// Find all dijit.form.RadioButtons and hook them up
	dojo.query(".dijitRadio", 'formContainer').forEach(function(n){
		var w = dijit.byNode(n);
		if(!w){ return; }
		w.connect(w, "onChange", addRemoveSeries);
	});

	// Hook up the play button
	var anim = null;
	dojo.connect(playButton, "onClick", function(){
		ballSurface.animate(slider.get('value'), easingForm.get('value').easing);
	});

	// Hook up the slider
	dojo.connect(slider, "onChange", function(value){
		dojo.byId('duration').innerHTML = value / 1000;
	});

	// Fade out the loading animation because everything is ready!
	dojo.fadeOut({
		node: 'preloader',
		onEnd: function(){
			dojo.style('preloader', 'display', 'none');
		}
	}).play();
});
