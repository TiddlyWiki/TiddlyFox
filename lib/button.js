/*
TiddlyFox main
*/
(function(){

"use strict";

var tabs = require("sdk/tabs");

function TiddlyButton(tiddlyPermissions) {
	var self = this,
		ToggleButton = require("sdk/ui/button/toggle").ToggleButton,
		Panel = require("sdk/panel").Panel;
	this.tiddlyPermissions = tiddlyPermissions;
	this.button = ToggleButton({
		id: "tiddlyfox-button",
		label: "TiddlyFox",
		icon: this.getIcons("plain"),
		onChange: this.handleChange.bind(this)
	});
	this.tabOwningPanel = null;
	this.panel = Panel({
		contentURL: "./panel.html",
		contentScriptFile: "./panel-content.js",
		onHide: this.handleHide.bind(this)
	});
	this.panel.port.on("tiddlywiki-enable-saving",function(message) {
		var tiddlyTab = self.getTiddlyTab();
		self.tiddlyPermissions.setUrlPermission(tiddlyTab.url,message.remember ? "all" : null);
		tiddlyTab.state = "enabled";
		tiddlyTab.enableSaving();
		self.updatePanel(tiddlyTab);
		self.updateButton(tiddlyTab);
	});
	this.panel.port.on("tiddlywiki-modify-saving",function(message) {
		var tiddlyTab = self.getTiddlyTab();
		self.tiddlyPermissions.setUrlPermission(tiddlyTab.url,message.remember ? "all" : null);
	});
}

TiddlyButton.prototype.registerTabs = function(tiddlyTabs) {
	this.tiddlyTabs = tiddlyTabs;
};

TiddlyButton.prototype.getTiddlyTab = function() {
	return this.tiddlyTabs.getTiddlyTab(tabs.activeTab.id) || {};
};

TiddlyButton.prototype.updatePanel = function(tiddlyTab) {
	var message =  {
			url: tiddlyTab.url,
			state: tiddlyTab.state,
			isTiddlyWiki: tiddlyTab.isTiddlyWiki,
			isTiddlyWiki5: tiddlyTab.isTiddlyWiki5,
			isTiddlyWikiClassic: tiddlyTab.isTiddlyWikiClassic,
			isLocalFile: tiddlyTab.isLocalFile,
			iconType: this.getIconType(tiddlyTab)
		};
	this.panel.port.emit("msg-init-panel",message);
};

TiddlyButton.prototype.handleChange = function(state) {
	if(state.checked) {
		var tiddlyTab = this.getTiddlyTab();
		this.updatePanel(tiddlyTab);
		this.panel.show({
			position: this.button
		});
		this.tabOwningPanel = tabs.activeTab;
	}
};

TiddlyButton.prototype.handleHide = function() {
	this.button.state(this.tabOwningPanel.window,{checked: false});
	this.tabOwningPanel = undefined;
};

TiddlyButton.prototype.updateButton = function(tabDetails) {
	this.button.state(tabDetails.tab,{
		icon: this.getIcons(this.getIconType(tabDetails))
	});
};

TiddlyButton.prototype.getIconType = function(tabDetails) {
	var iconType = "plain";
	if(tabDetails.state === "duplicate") {
		iconType = "disabled";
	} else if(tabDetails.state === "ask") {
		iconType = "alert";
	} else if(tabDetails.state === "enabled") {
		iconType = "enabled";
	}
	return iconType;
};

TiddlyButton.prototype.getIcons = function(type) {
	return {
		"16": "./images/tiddlyfox-" + type + ".png",
		"32": "./images/tiddlyfox-" + type + "@2x.png",
		"64": "./images/tiddlyfox-" + type + "@3x.png"
	};
};

exports.TiddlyButton = TiddlyButton;

})();
