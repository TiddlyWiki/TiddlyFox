/*
Content script for tabs
*/

(function () {

"use strict";

var idGenerator = 1; // Used to generate callback message IDs

/*
** Test if this is a TiddlyWiki
*/
function testResults() {
	var results = {};
	// Test for TiddlyWiki Classic
	var versionArea = document.getElementById("versionArea");
	results.isTiddlyWikiClassic = (document.location.protocol === "file:") &&
		document.getElementById("storeArea") &&
		(versionArea && /TiddlyWiki/.test(versionArea.textContent));
	// Test for TiddlyWiki 5
	var metaTags = document.getElementsByTagName("meta");
	for(var t=0; t<metaTags.length; t++) {
		if(metaTags[t].name === "application-name" && metaTags[t].content === "TiddlyWiki") {
			results.isTiddlyWiki5 = true;
		}
	}
	results.isTiddlyWiki = results.isTiddlyWikiClassic || results.isTiddlyWiki5;
	// Test for file URI
	if(document.location.protocol === "file:") {
		results.isLocalFile = true;
	}
	return results;	
}

/*
** Send initialisation results back
*/
self.port.emit("tiddlywiki-init-completed",testResults());

/*
** Set up handler for injecting code
*/
self.port.on("inject-script",function(message) {
	var code = document.createTextNode(message.script);
	var scr = document.createElement("script");
	scr.type = "text/javascript";
	scr.appendChild(code);
	document.getElementsByTagName("head")[0].appendChild(scr);
});

/*
** Set up handler for enabling file saving
*/
self.port.on("enable-saving",function(message) {
	// Inject the message box
	var messageBox = document.getElementById("tiddlyfox-message-box");
	if(!messageBox) {
		messageBox = document.createElement("div");
		messageBox.id = "tiddlyfox-message-box";
		messageBox.style.display = "none";
		document.body.appendChild(messageBox);
	}
	// Attach the event handler to the message box
	messageBox.addEventListener("tiddlyfox-save-file",onSaveTiddlyWiki,false);
});

function onSaveTiddlyWiki(event) {
	// Get the details from the message
	var messageElement = event.target,
		path = messageElement.getAttribute("data-tiddlyfox-path"),
		content = messageElement.getAttribute("data-tiddlyfox-content"),
		backupPath = messageElement.getAttribute("data-tiddlyfox-backup-path"),
		messageId = "tiddlywiki-save-file-response-" + idGenerator++;
	// Remove the message element from the message box
	messageElement.parentNode.removeChild(messageElement);
	// Save the file
	self.port.emit("tiddlywiki-save-file",{
		path: path,
		content: content,
		backupPath: backupPath,
		messageId: messageId
	});
	self.port.once(messageId,function(message) {
		// Send a confirmation message
		var event = document.createEvent("Events");
		event.initEvent("tiddlyfox-have-saved-file",true,false);
		event.savedFilePath = path;
		messageElement.dispatchEvent(event);
	})
	return false;
}

/*
** Set up handler for disabling file saving
*/
self.port.on("disable-saving",function(message) {
	// Remove the message box
	var messageBox = document.getElementById("tiddlyfox-message-box");
	if(!messageBox) {
		messageBox.parentNode.removeChild(messageBox);
	}
});

/*
** Set up handler for marking duplicate
*/
self.port.on("mark-duplicate",function(message) {
	var div = document.createElement("div"),
		pMsg = document.createElement("p"),
		textMsgNode = document.createTextNode("TiddlyWiki for Firefox: This TiddlyWiki file is already open in another tab"),
		pUrl = document.createElement("p"),
		textUrlNode = document.createTextNode(message.url);
	pMsg.appendChild(textMsgNode);
	pMsg.style = "font-weight: 700;";
	div.appendChild(pMsg);
	pUrl.appendChild(textUrlNode);
	div.appendChild(pUrl);
	div.style = "position: fixed; left: 0; top: 0; right: 0; color: white; background: red; border: 4px solid black; text-align: center; margin: 8px; z-index: 10000;";
	document.body.appendChild(div);
	div.addEventListener("click",function(event) {
		document.body.removeChild(div);
	},false);
});

})();
