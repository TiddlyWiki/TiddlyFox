/*
TiddlyFox main
*/
(function(){

"use strict";

/*
** Initialise persistent storage
*/
var persistentStorage = require("sdk/simple-storage").storage;

/*
Hashmap by URL of string:
"none" or missing: No permission granted
"all": Permission granted to access entire file system
*/
persistentStorage.permissions = persistentStorage.permissions || {};


function TiddlyPermissions() {
}

TiddlyPermissions.prototype.setUrlPermission = function(url,value) {
	persistentStorage.permissions[url] = value;
};

TiddlyPermissions.prototype.getUrlPermission = function(url) {
	if(Object.prototype.hasOwnProperty.call(persistentStorage.permissions,url)) {
		return persistentStorage.permissions[url];
	} else {
		return null;
	}
};

TiddlyPermissions.prototype.removeUrlPermission = function(url) {
	if(Object.prototype.hasOwnProperty.call(persistentStorage.permissions,url)) {
		delete persistentStorage.permissions[url];
	}
};

exports.TiddlyPermissions = TiddlyPermissions;

})();
