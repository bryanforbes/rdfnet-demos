dojo.provide("my.PlotKit.claro");
dojo.require("dojox.charting.themes.PlotKit.base");

(function(){
	// Custom PlotKit theme courtesy of Tom Trenka
	var dc = dojox.charting, pk = dc.themes.PlotKit, mpk = my.PlotKit;

	var claro = mpk.claro = pk.claro = pk.base.clone();
	claro.chart.fill = claro.plotarea.fill = "#c4e0f2";
	claro.colors = dc.Theme.defineColors({hue: 204, saturation: 55, low: 45, high: 75});
})();
