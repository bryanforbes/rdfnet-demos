dojo.provide("my.Foo");

dojo.require("dijit.form.Button");

dojo.declare("my.Foo", dijit.form.Button, {
	onClick: function(){
		alert('Button clicked!!');
	}
});
