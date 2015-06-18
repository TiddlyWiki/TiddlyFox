/*
TiddlyFox main
*/
(function(){

"use strict";

var TiddlyButton = require("./lib/button.js").TiddlyButton,
	{TiddlyTabs, TiddlyTab} = require("./lib/tabs.js"),
	TiddlyPermissions = require("./lib/permissions.js").TiddlyPermissions;

// Permissions
var tiddlyPermissions = new TiddlyPermissions();

// Button and panel
var tiddlyButton = new TiddlyButton(tiddlyPermissions);

// Tab state
var tiddlyTabs = new TiddlyTabs(tiddlyButton,tiddlyPermissions);

tiddlyButton.registerTabs(tiddlyTabs);

// Process initial tabs
var tabs = require("sdk/tabs");
for(let tab of tabs) {
	tiddlyTabs.addTiddlyTab(tab);
}

// Process subsequently created tabs
tabs.on("ready", function(tab) {
	tiddlyTabs.addTiddlyTab(tab);
});

})();
