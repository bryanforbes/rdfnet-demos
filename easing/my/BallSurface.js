dojo.provide("my.BallSurface");

dojo.require("dojox.gfx.fx");
dojo.require("dijit._Widget");

dojo.declare("my.BallSurface", dijit._Widget, {
	ball: null,
	surface: null,

	postCreate: function(){
		this.inherited(arguments);

		// create the animation surface
		var cb = dojo.contentBox(this.domNode);
		var surface = this.surface = dojox.gfx.createSurface(this.domNode, cb.w + "px", cb.h + "px");

		// create the ball
		var ball = this.ball = surface.createCircle({
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
	},

	animate: function(duration, easing){
		var anim = this._anim;
		if(anim){
			anim.stop();
		}
		anim = this._anim = dojox.gfx.fx.animateTransform({
				shape: this.ball,
				duration: parseInt(duration, 10),
				easing: dojo.fx.easing[easing],
				transform: [
					{ name: "translate", start: [0, 0], end: [800, 0] }
				]
			});
		anim.play();
	}
});
