/*
Content script for panel
*/

(function () {

"use strict";

self.port.on("msg-init-panel",function(message) {
	// Set the logo
	document.getElementById("id-branding-logo").src = "./images/tiddlyfox-" + message.iconType + ".svg";
	// Get the parts
	var sectionEnableSaving = document.getElementById("id-enable-saving"),
		sectionEnableSavingRemember = document.getElementById("id-enable-saving-remember");
	sectionEnableSaving.hidden = true;
	sectionEnableSavingRemember.hidden = true;
	// Set the prompt text
	var prompt = "";
	switch(message.state) {
		case "created":
			prompt = "Loading details";
			break;
		case "unknown":
			prompt = "This is not a local TiddlyWiki file";
			break;
		case "duplicate":
			prompt = "This TiddlyWiki file is already loaded into a different tab";
			break;
		case "ask":
			prompt = "Do you wish to enable saving for this TiddlyWiki file?";
			sectionEnableSaving.hidden = false;
			sectionEnableSavingRemember.hidden = false;
			break;
		case "enabled":
			prompt = "Saving is enabled for this TiddlyWiki file";
			sectionEnableSavingRemember.hidden = false;
			break;
	}
	document.getElementById("id-prompt").textContent = prompt;
	document.getElementById("id-url").textContent = message.url;
});

var saveButton = document.getElementById("id-enable-saving-button");
saveButton.addEventListener("click",function (event) {
	var checkbox = document.getElementById("id-enable-saving-remember-checkbox");
	self.port.emit("tiddlywiki-enable-saving",{
		remember: checkbox.checked
	});
},false);

var saveCheckbox = document.getElementById("id-enable-saving-remember-checkbox");
saveCheckbox.addEventListener("change",function (event) {
	self.port.emit("tiddlywiki-modify-saving",{
		remember: saveCheckbox.checked
	});
},false);

})();
