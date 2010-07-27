dojo.require("dojo.fx.easing");
dojo.require("dojox.gfx.fx");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.HorizontalSlider");
dojo.require("dojox.charting.widget.Chart2D");
dojo.require("dojox.charting.themes.PlotKit.base");

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

	// Custom PlotKit theme courtesy of Tom Trenka
	var dc = dojox.charting, pk = dc.themes.PlotKit;
	pk.claro = pk.base.clone();
	pk.claro.chart.fill = pk.claro.plotarea.fill = "#c4e0f2";
	pk.claro.colors = dc.Theme.defineColors({hue: 204, saturation: 55, low: 45, high: 75});

	// create the chart
	var chart = new dojox.charting.Chart2D('easingChart');

	// monkey-patch the chart's render to add axis titles
	var oldRender = chart.render;
	chart.render = function(){
		oldRender.call(this);
		var axes = this.axes,
			theme_tick = this.theme.axis.tick,
			theme_font = theme_tick.font,
			theme_font_color = theme_tick.fontColor,
			dim = this.dim,
			offsets = this.offsets,
			x_middle = (dim.width / 2) + (offsets.l / 2),
			y_middle = (dim.height / 2) - (offsets.b / 2),
			m = dojox.gfx.matrix;

		// For each axis defined, loop through, check if there
		// is a 'title' property defined.
		for(var i in axes){
			var axis = axes[i];
			if(axis.opt.title){
				var x, y,
					rotate = 0;

				// If the axis is vertical, rotate it
				if(axis.vertical){
					rotate = 270;
					y = y_middle;
					x = 12;
				}else{
					x = x_middle;
					y = dim.height - 2;
				}

				// Render the text in the middle of the chart
				var elem = axis.group.createText({
					x: x_middle,
					y: y_middle,
					text: axis.opt.title,
					align: 'middle'
				});

				// Set the font and font color
				elem.setFont(axis.opt.font || theme_font).setFill(axis.opt.fontColor || theme_font_color);

				// If the axis is vertical, rotate and move into position,
				// otherwise just move into position.
				if(rotate){
					elem.setTransform([
						m.rotategAt(rotate, x_middle, y_middle),
						m.translate(0, x - x_middle)
					]);
				}else{
					elem.setTransform(m.translate(0, y - y_middle))
				}
			}
		}
	};
	// end monkey-patch

	chart.addPlot('default', { type: 'Areas', tension: 2 })
		.addAxis('x', { title: 'Percent Complete', minorTicks: false, majorTickStep: 200, labels: xLabels })
		.addAxis('y', { title: 'Position (px)', minorTicks: false, vertical: true, majorTickStep: 100 })
		.setTheme(dojox.charting.themes.PlotKit.claro)
		.addSeries('linear', getSeries('linear'))
		.render();

	// create the animation surface
	var cb = dojo.contentBox('animation');
	var surface = dojox.gfx.createSurface('animation', cb.w + "px", cb.h + "px");

	// create the ball
	var ball = surface.createCircle({
		cx: 50,
		cy: 79,
		r: 45
	}).setFill({
		type: 'radial',
		cx: 40,
		cy: 71,
		r: 57,
		colors: [
			{ offset: 0, color: "#f7fafc" },
			{ offset: 0.15, color: "#d0e2ee" },
			{ offset: 0.22, color: "#bdd7e8" },
			{ offset: 0.66, color: "#a7c9e0" },
			{ offset: 1, color: "#77accf" }
		]
	});

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
		if(anim){
			anim.stop();
		}
		var easing = easingForm.attr('value').easing;
		anim = dojox.gfx.fx.animateTransform({
				shape: ball,
				duration: parseInt(slider.attr('value'), 10),
				easing: dojo.fx.easing[easing],
				transform: [
					{ name: "translate", start: [0, 0], end: [800, 0] }
				]
			});
		anim.play();
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
