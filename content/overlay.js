/*

The JavaScript code in this file is executed via `overlay.xul` when Firefox starts up.

*/

var TiddlyFox = {

	// Name of the permission for TiddlyFox used by Firefox
	TIDDLYFOX_PERMISSION: "tiddlyfox.saving.permission",

	// Called when the main browser has loaded
	onLoad: function(event) {
		// Register a page load event
		var appcontent = document.getElementById("appcontent");
		// Further check for Firefox on Android (fennec)
		if(!appcontent) {
			appcontent = document.getElementById("browsers"); // Fennec
		}
		if(appcontent){
			appcontent.addEventListener("DOMContentLoaded",TiddlyFox.onPageLoad,true);
		}
	},

	// Called each time a page loads
	onPageLoad: function(event) {
		// Get the document and window and uri
		var doc = event.originalTarget,
			win = doc.defaultView,
			uri = TiddlyFox.getPageUri(doc);
		// Check if this is a TiddlyWiki document
		var isTiddlyWikiClassic = TiddlyFox.isTiddlyWikiClassic(doc,win),
			isTiddlyWiki5 = TiddlyFox.isTiddlyWiki5(doc,win),
			approved = false;
		// Prompt the user if they haven't already approved this document
		if(isTiddlyWikiClassic || isTiddlyWiki5) {
			if(checkPermission(uri)) {
				approved = true;
			} else {
				approved = confirm("TiddlyFox: Do you want to enable TiddlyWiki file saving capability for " + uri);
			}
		}
		if(approved) {
			// Save the approval for next time
			setPermission(uri);
			TiddlyFox.injectMessageBox(doc); // Always inject the message box
			if(isTiddlyWikiClassic) {
				TiddlyFox.injectScript(doc); // Only inject the script for TiddlyWiki classic
			}
		}
	},

	getPageUri: function(doc) {
		return doc.location.protocol + "//" + doc.location.host + doc.location.pathname;
	},

	injectScript: function(doc) {
		// Load the script text
		var xhReq = new XMLHttpRequest();
		xhReq.open("GET","chrome://tiddlyfox/content/inject.js",false);
		xhReq.send(null);
		var injectCode = xhReq.responseText;
		// Inject the script
		var code = doc.createTextNode(injectCode);
		var scr = doc.createElement("script");
		scr.type = "text/javascript";
		scr.appendChild(code);
		doc.getElementsByTagName("head")[0].appendChild(scr)
	},

	injectMessageBox: function(doc) {
		// Inject the message box
		var messageBox = doc.getElementById("tiddlyfox-message-box");
		if(!messageBox) {
			messageBox = doc.createElement("div");
			messageBox.id = "tiddlyfox-message-box";
			messageBox.style.display = "none";
			doc.body.appendChild(messageBox);
		}
		// Attach the event handler to the message box
		messageBox.addEventListener("tiddlyfox-save-file",TiddlyFox.onSaveFile,false);
	},

	saveFile: function(filePath,content) {
		// Attempt to convert the filepath to a proper UTF-8 string
		try {
			var converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].getService(Components.interfaces.nsIUTF8ConverterService);
			filePath = converter.convertURISpecToUTF8(filePath,"UTF-8");
		} catch(ex) {
		}
		// Save the file
		try {
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				file.create(0,0x01B4);// 0x01B4 = 0664
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file,0x22,0x04,null);
			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
			converter.init(out, "UTF-8", 0, "?".charCodeAt(0));
			converter.writeString(content);
			converter.close();
			out.close();
			return true;
		} catch(ex) {
			alert(ex);
			return false;
		}
	},

	onSaveFile: function(event) {
		// Get the details from the message
		var message = event.target,
			path = message.getAttribute("data-tiddlyfox-path"),
			content = message.getAttribute("data-tiddlyfox-content");
		// Save the file
		TiddlyFox.saveFile(path,content);
		// Remove the message element from the message box
		message.parentNode.removeChild(message);
		// Send a confirmation message
		var event = document.createEvent("Events");
		event.initEvent("tiddlyfox-have-saved-file",true,false);
		event.savedFilePath = path;
		message.dispatchEvent(event);
		return false;
	},

	// Called via `overlay.xul` when the menu item is selected
	onMenuItemCommand: function() {
		window.open("chrome://tiddlyfox/content/hello.xul", "", "chrome");
	},

	isTiddlyWikiClassic: function(doc,win) {
		// Test whether the document is a TiddlyWiki (we don't have access to JS objects in it)
		var versionArea = doc.getElementById("versionArea");
		return (doc.location.protocol === "file:") &&
			doc.getElementById("storeArea") &&
			(versionArea && /TiddlyWiki/.test(versionArea.text));
	},

	isTiddlyWiki5: function(doc,win) {
		// Test whether the document is a TiddlyWiki5 (we don't have access to JS objects in it)
		var metaTags = doc.getElementsByTagName("meta"),
			generator = false;
		for(var t=0; t<metaTags.length; t++) {
			if(metaTags[t].name === "application-name" && metaTags[t].content === "TiddlyWiki") {
				generator = true;
			}
		}
		return (doc.location.protocol === "file:") && generator;
	}

};

function checkPermission(uri) {
	try {
		var pm = Components.classes["@mozilla.org/permissionmanager;1"].createInstance(Components.interfaces.nsIPermissionManager);
		return pm.testExactPermission(makeURI(uri),TiddlyFox.TIDDLYFOX_PERMISSION);
	} catch(e) {
		return false;
	}
}

function setPermission(uri) {
	try {
		var pm = Components.classes["@mozilla.org/permissionmanager;1"].createInstance(Components.interfaces.nsIPermissionManager);
		pm.add(makeURI(uri),TiddlyFox.TIDDLYFOX_PERMISSION,pm.ALLOW_ACTION,pm.EXPIRE_NEVER,0);
	} catch(e) {
		
	}
}

function makeURI(uri) {
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	return ios.newURI(uri,null,null);
}

window.addEventListener("load",function load(event) {
	window.removeEventListener("load",load,false);
	TiddlyFox.onLoad(event);
},false); 
