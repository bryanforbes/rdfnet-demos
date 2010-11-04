(function(global){
	var NON_HOST_TYPES = { "boolean": 1, "number": 1, "string": 1, "undefined": 1 },
		_listen, _stopListening, normalizeEventName;

	// Imported from http://github.com/phiggins42/has.js.
    // Host objects can return type values that are different from their actual
    // data type. The objects we are concerned with usually return non-primitive
    // types of object, function, or unknown.
    function isHostType(object, property){
        var type = typeof object[property];
        return type == 'object' ? !!object[property] : !NON_HOST_TYPES[type];
    }

	if(isHostType(document, "addEventListener")){
		_listen = function _listen(obj, evt, handler){
			obj.addEventListener(evt, handler, false);
		};
		_stopListening = function _stopListening(obj, evt, handler){
			obj.removeEventListener(evt, handler, false);
		};
		normalizeEventName = function normalizeEventName(/*String*/ name){
			// Generally, name should be lower case, unless it is special
			// somehow (e.g. a Mozilla DOM event).
			// Remove 'on'.
			return name.slice(0,2) =="on" ? name.slice(2) : name;
		};
	}else if(isHostType(document, "attachEvent")){
		_listen = function _listen(obj, evt, handler){
			obj.attachEvent(evt, handler);
		};
		_stopListening = function _stopListening(obj, evt, handler){
			obj.detachEvent(evt, handler);
		};
		normalizeEventName = function normalizeEventName(/*String*/ eventName){
			// Generally, eventName should be lower case, unless it is
			// special somehow (e.g. a Mozilla event)
			// ensure 'on'
			return eventName.slice(0,2) != "on" ? "on" + eventName : eventName;
		};
	}

	global.isHostType = isHostType;
	global._listen = _listen;
	global._stopListening = _stopListening;
	global.normalizeEventName = normalizeEventName;
})(this);
