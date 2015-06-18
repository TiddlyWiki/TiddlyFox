/*
TiddlyFox main
*/
(function(){

"use strict";

/*
State values:
	"created": tab loaded, content script injected and now waiting for initialisation to return
	"unknown": tab loaded but has been found not to be a TiddlyWiki
	"duplicate": tab has the same URL as another tab
	"enabled": tab is a TiddlyWiki and saving is enabled
	"disabled": tab is a TiddlyWiki and saving is not enabled
*/
function TiddlyTab() {
	this.tab = null;
	this.state = "created";
	this.url = "";
	this.isTiddlyWiki = false;
	this.isTiddlyWiki5 = false;
	this.isTiddlyWikiClassic = false;
	this.isLocalFile = false;
	this.worker = null; // Reference to content script attached to tab
}

TiddlyTab.prototype.getNormalisedURL = function() {
	var URL = require("sdk/url").URL,
		url = URL(this.tab.url);
	return (url.protocol || "") + "//" + (url.hostname || "") + (url.pathname || "");
};

TiddlyTab.prototype.enableSaving = function() {
	// Tell the content script to enable saving
	this.worker.port.emit("enable-saving");
	if(this.isTiddlyWikiClassic) {
		// Tell the content script to inject the TiddlyWiki Classic shim
		var injectedScript = require("sdk/self").data.load("./inject.js");
		this.worker.port.emit("inject-script",{script: injectedScript});
	}
};

function TiddlyTabs(tiddlyButton,tiddlyPermissions) {
	this.tiddlyButton = tiddlyButton;
	this.tiddlyPermissions = tiddlyPermissions;
	this.tiddlyTabs = {};
}

TiddlyTabs.prototype.addTiddlyTab = function(tab) {
	var self = this;
	// Add an entry for this tab
	this.removeTiddlyTab(tab.id);
	var tiddlyTab = new TiddlyTab();
	tiddlyTab.tab = tab;
	var theID = tab.id;
	this.tiddlyTabs[theID] = tiddlyTab;
	// Attach the worker
	tiddlyTab.worker = tab.attach({
		contentScriptFile: "./tab-content.js"
	});
	// Wait for the initialisation completed message
	tiddlyTab.worker.port.on("tiddlywiki-init-completed",function(message) {
		// Update the tab state
		var urlString = tiddlyTab.getNormalisedURL();
		tiddlyTab.url = urlString;
		tiddlyTab.isTiddlyWiki = message.isTiddlyWiki;
		tiddlyTab.isTiddlyWikiClassic = message.isTiddlyWikiClassic;
		tiddlyTab.isTiddlyWiki5 = message.isTiddlyWiki5;
		tiddlyTab.isLocalFile = message.isLocalFile;
		// Enable saving for TiddlyWikis
		if(message.isLocalFile && message.isTiddlyWiki) {
			// Check if the file is already open in a different tab
			if(self.getTiddlyTabByUrl(urlString,theID)) {
				tiddlyTab.state = "duplicate";
				tiddlyTab.worker.port.emit("mark-duplicate",{url: urlString});
			} else {
				// Check whether saving is enabled for this URL
				if(self.tiddlyPermissions.getUrlPermission(urlString) === "all") {
					tiddlyTab.state = "enabled";
					tiddlyTab.enableSaving();
				} else {
					tiddlyTab.state = "ask";
				}
			}
		} else {
			tiddlyTab.state = "unknown";
		}
		// Update the button according to the status
		self.tiddlyButton.updateButton(tiddlyTab);
	});
	// Handle requests to save files
	tiddlyTab.worker.port.on("tiddlywiki-save-file",function(message) {
		self.saveFile(message.path,message.content);
		// Return confirmation
		tiddlyTab.worker.port.emit(message.messageId,{error: null});
	});
	// Handle the tab closing
	tiddlyTab.tab.on("close",function() {
		self.removeTiddlyTab(theID);
	});
};

TiddlyTabs.prototype.saveFile = function(path,content) {
	// Save file
	var fileIO = require("sdk/io/file"),
		stream = fileIO.open(path,"w");
	stream.write(content);
	stream.close();
};

TiddlyTabs.prototype.removeTiddlyTab = function(id) {
	if(this.tiddlyTabs[id]) {
		delete this.tiddlyTabs[id];
	}
};

TiddlyTabs.prototype.getTiddlyTab = function(id) {
	return this.tiddlyTabs[id];
};

TiddlyTabs.prototype.getTiddlyTabByUrl = function(url,excludeId) {
	for(var id in this.tiddlyTabs) {
		var tabDetail = this.tiddlyTabs[id];
		if(tabDetail.url === url && tabDetail.state !== "duplicate" && id !== excludeId) {
			return tabDetail;
		}
	}
	return null;
};

TiddlyTabs.prototype.dump = function() {
	console.log("Tab details:");
	for(var id in this.tiddlyTabs) {
		var tiddlyTab = this.tiddlyTabs[id];
		console.log("Tab " + id + ": " + tiddlyTab.url + ", state: " + tiddlyTab.state);
	}
};

exports.TiddlyTab = TiddlyTab;
exports.TiddlyTabs = TiddlyTabs;

})();
