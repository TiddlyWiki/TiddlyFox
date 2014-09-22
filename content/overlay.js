/*

The JavaScript code in this file is executed via `overlay.xul` when Firefox starts up.

*/
var TiddlyFox = (function () {
var util = {
	
	Date : function () {
		this.date = new Date();
	},

	CreateAPI : function (name, index, array) {
			util.Date.prototype[name] =function () {
			return(this.date[name]());
		}
	}
};
["getDate",   "getFullYear",   "getMonth",   "getDay",   "getHours",   "getMinutes",   "getSeconds",   "getMilliseconds"   ].forEach(util.CreateAPI);
["getUTCDate","getUTCFullYear","getUTCMonth","getUTCDay","getUTCHours","getUTCMinutes","getUTCSeconds","getUTCMilliseconds"].forEach(util.CreateAPI);
["getTime","getTimezoneOffset"].forEach(util.CreateAPI);


// ---------------------------------------------------------------------------------
// Start of Utility functions copied from TiddlyWiki.
// ---------------------------------------------------------------------------------





var zeroPad = function(n,d)
{
    var s = n.toString();
    if(s.length < d)
            s = "000000000000000000000000000".substr(0,d-s.length) + s;
    return(s);
}

// Convert a date to UTC YYYYMMDDHHMM string format
util.Date.prototype.convertToYYYYMMDDHHMM = function()
{
    return(zeroPad(this.getUTCFullYear(),4) + zeroPad(this.getUTCMonth()+1,2) + zeroPad(this.getUTCDate(),2) + zeroPad(this.getUTCHours(),2) + zeroPad(this.getUTCMinutes(),2));
}

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
util.Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
	return(zeroPad(this.getUTCFullYear(),4) + zeroPad(this.getUTCMonth()+1,2) + zeroPad(this.getUTCDate(),2) + "." + zeroPad(this.getUTCHours(),2) + zeroPad(this.getUTCMinutes(),2) + zeroPad(this.getUTCSeconds(),2) + zeroPad(this.getUTCMilliseconds(),4));
}




// Convert a date to UTC YYYY-MM-DD HH:MM string format
util.Date.prototype.convertToFullDate = function()
{
    return(zeroPad(this.getUTCFullYear(),4) + "-" +
           zeroPad(this.getUTCMonth()+1,2) + "-" + 
           zeroPad(this.getUTCDate(),2) + " " + 
           zeroPad(this.getUTCHours(),2) + ":" + 
           zeroPad(this.getUTCMinutes(),2));
}

util.Date.prototype.formatString = function(template)
{
	var t = template.replace(/0hh12/g,zeroPad(this.getHours12(),2));
	t = t.replace(/hh12/g,this.getHours12());
	t = t.replace(/0hh/g,zeroPad(this.getHours(),2));
	t = t.replace(/hh/g,this.getHours());
	t = t.replace(/mmm/g,dateS.shortMonths[this.getMonth()]);
	t = t.replace(/0mm/g,zeroPad(this.getMinutes(),2));
	t = t.replace(/mm/g,this.getMinutes());
	t = t.replace(/0ss/g,zeroPad(this.getSeconds(),2));
	t = t.replace(/ss/g,this.getSeconds());
	t = t.replace(/[ap]m/g,this.getAmPm().toLowerCase());
	t = t.replace(/[AP]M/g,this.getAmPm().toUpperCase());
	t = t.replace(/wYYYY/g,this.getYearForWeekNo());
	t = t.replace(/wYY/g,zeroPad(this.getYearForWeekNo()-2000,2));
	t = t.replace(/YYYY/g,this.getFullYear());
	t = t.replace(/YY/g,zeroPad(this.getFullYear()-2000,2));
	t = t.replace(/MMM/g,dateS.months[this.getMonth()]);
	t = t.replace(/0MM/g,zeroPad(this.getMonth()+1,2));
	t = t.replace(/MM/g,this.getMonth()+1);
	t = t.replace(/0WW/g,zeroPad(this.getWeek(),2));
	t = t.replace(/WW/g,this.getWeek());
	t = t.replace(/DDD/g,dateS.days[this.getDay()]);
	t = t.replace(/ddd/g,dateS.shortDays[this.getDay()]);
	t = t.replace(/0DD/g,zeroPad(this.getDate(),2));
	t = t.replace(/DDth/g,this.getDate()+this.daySuffix());
	t = t.replace(/DD/g,this.getDate());
	var tz = this.getTimezoneOffset();
	var atz = Math.abs(tz);
	t = t.replace(/TZD/g,(tz < 0 ? '+' : '-') + zeroPad(Math.floor(atz / 60),2) + ':' + zeroPad(atz % 60,2));
	t = t.replace(/\\/g,"");
	return t;
};

util.Date.prototype.getWeek = function()
{
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	if(d==0) d=7;// JavaScript Sun=0, ISO Sun=7
	dt.setTime(dt.getTime()+(4-d)*86400000);// shift day to Thurs of same week to calculate weekNo
	var n = Math.floor((dt.getTime()-new Date(dt.getFullYear(),0,1)+3600000)/86400000);
	return Math.floor(n/7)+1;
};

util.Date.prototype.getYearForWeekNo = function()
{
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	if(d==0) d=7;// JavaScript Sun=0, ISO Sun=7
	dt.setTime(dt.getTime()+(4-d)*86400000);// shift day to Thurs of same week
	return dt.getFullYear();
};

util.Date.prototype.getHours12 = function()
{
	var h = this.getHours();
	return h > 12 ? h-12 : ( h > 0 ? h : 12 );
};

util.Date.prototype.getAmPm = function()
{
	return this.getHours() >= 12 ? dateS.pm : dateS.am;
};

util.Date.prototype.daySuffix = function()
{
	return dateS.daySuffixes[this.getDate()-1];
};

// Convert a date to local YYYYMMDDHHMM string format
util.Date.prototype.convertToLocalYYYYMMDDHHMM = function()
{
	return this.getFullYear() + zeroPad(this.getMonth()+1,2) + zeroPad(this.getDate(),2) + zeroPad(this.getHours(),2) + zeroPad(this.getMinutes(),2);
};

// Convert a date to UTC YYYYMMDDHHMM string format
util.Date.prototype.convertToYYYYMMDDHHMM = function()
{
	return this.getUTCFullYear() + zeroPad(this.getUTCMonth()+1,2) + zeroPad(this.getUTCDate(),2) + zeroPad(this.getUTCHours(),2) + zeroPad(this.getUTCMinutes(),2);
};

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
util.Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
	return this.getUTCFullYear() + zeroPad(this.getUTCMonth()+1,2) + zeroPad(this.getUTCDate(),2) + "." + zeroPad(this.getUTCHours(),2) + zeroPad(this.getUTCMinutes(),2) + zeroPad(this.getUTCSeconds(),2) + zeroPad(this.getUTCMilliseconds(),3) +"0";
};

// Static method to create a date from a UTC YYYYMMDDHHMM format string
util.Date.convertFromYYYYMMDDHHMM = function(d)
{
	d = d?d.replace(/[^0-9]/g, ""):"";
	return util.Date.convertFromYYYYMMDDHHMMSSMMM(d.substr(0,12));
};

// Static method to create a date from a UTC YYYYMMDDHHMMSS format string
util.Date.convertFromYYYYMMDDHHMMSS = function(d)
{
	d = d?d.replace(/[^0-9]/g, ""):"";
	return util.Date.convertFromYYYYMMDDHHMMSSMMM(d.substr(0,14));
};

// Static method to create a date from a UTC YYYYMMDDHHMMSSMMM format string
util.Date.convertFromYYYYMMDDHHMMSSMMM = function(d)
{
	d = d ? d.replace(/[^0-9]/g, "") : "";
	return new Date(Date.UTC(parseInt(d.substr(0,4),10),
			parseInt(d.substr(4,2),10)-1,
			parseInt(d.substr(6,2),10),
			parseInt(d.substr(8,2)||"00",10),
			parseInt(d.substr(10,2)||"00",10),
			parseInt(d.substr(12,2)||"00",10),
			parseInt(d.substr(14,3)||"000",10)));
};
var dateS ={};
dateS.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
dateS.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
dateS.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
dateS.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// suffixes for dates, eg "1st","2nd","3rd"..."30th","31st"
dateS.daySuffixes = ["st","nd","rd","th","th","th","th","th","th","th",
		"th","th","th","th","th","th","th","th","th","th",
		"st","nd","rd","th","th","th","th","th","th","th",
		"st"];
dateS.am = "am";
dateS.pm = "pm";

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
 copyFile: function(sourcefile,destdir)
{
  // get a component for the file to copy
  var aFile = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
  if (!aFile) return false;

  // get a component for the directory to copy to
  var aDir = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
  if (!aDir) return false;

  // next, assign URLs to the file components
  aFile.initWithPath(sourcefile);
  aDir.initWithPath(TiddlyFox.getSpecialBackupPath(sourcefile));

  // finally, copy the file
  
  aFile.copyTo(aDir,TiddlyFox.getSpecialBackupFile(sourcefile));
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
			TiddlyFox.copyFile(filePath,"/media/3497f82e-3b95-41de-90af-df905eceeab4/data/radice/firefoxextension/Tw516/plugins/etc");
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

getSpecialBackupPath: function(localPath) {
	var slash = "\\";
	var dirPathPos = localPath.lastIndexOf("\\");
	if(dirPathPos == -1) {
		dirPathPos = localPath.lastIndexOf("/");
		slash = "/";
	}
	var backupFolder = "backups";//config.options.txtBackupFolder;
	if(!backupFolder || backupFolder == "")
		backupFolder = ".";
	backupFolder=localPath.substr(0,dirPathPos) + slash + backupFolder;alert(backupFolder);
	return backupFolder;
},
getSpecialBackupFile: function(localPath) {
	var slash = "\\";
	var dirPathPos = localPath.lastIndexOf("\\");
	if(dirPathPos == -1) {
		dirPathPos = localPath.lastIndexOf("/");
		slash = "/";
	} 
	var backupPath = localPath.substr(dirPathPos+1);
	backupPath = backupPath.substr(0,backupPath.lastIndexOf(".")) + ".";
        //if (config.options.chkOneADayBackUpFile==true)
	        backupPath += (new util.Date()).convertToYYYYMMDDHHMMSSMMM().replace (/(.*)\.(.*)/,"$1") + "." + "html";
        //else 
	     //   backupPath += (new Date()).convertToYYYYMMDDHHMMSSMMM() + "." + "html";
	     alert(backupPath);
	return backupPath;
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
			(versionArea && /TiddlyWiki/.test(versionArea.textContent));
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
return TiddlyFox;




}());
