<<<<<<< HEAD
# Introduction

TiddlyWiki for Firefox is an add-on that enables [http://tiddlywiki.com](TiddlyWiki) to save changes directly to the filing system.

If you are an end user then you don't this repository; you should install the latest released version of TiddlyWiki for Firefox via the Mozilla Add-on library:

https://addons.mozilla.org/en-US/firefox/addon/tiddlyfox/

# Development Prerequisites

Install jpm as described in the Firefox Add-on SDK:

https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm

# Build Instructions

To debug TiddlyWiki for Firefox within a clean instance of Firefox:

```
cd {tiddlywiki for firefox directory}
jpm run
```

To build the TiddlyWiki for Firefox XPI file:

```
cd {tiddlywiki for firefox directory}
jpm xpi
```
=======
# Introduction

TiddlyFox is an extension for Mozilla Firefox that enables TiddlyWiki to save changes directly to the file system. TiddlyWiki is complete wiki packaged as a standalone HTML file; see http://tiddlywiki.com/ for more details.

# Installation

TiddlyFox can be installed from Mozilla's Add-ons page:

https://addons.mozilla.org/en-US/firefox/addon/tiddlyfox/

However, due to the duration of Mozilla's approval process, you will often find a more up to date version here on Github:

https://github.com/TiddlyWiki/TiddlyFox/raw/master/tiddlyfox.xpi

# Building the extension

The shell script `build_mac.sh` builds `tiddlyfox.api` successfully on Mac OS X.

# Development mode installation

To make it easier to work on the extension, you can configure Firefox to use the unpacked, development version of the extension. To set it up, edit the file `tiddlyfox@tiddlywiki.org` to contain your local path to the TiddlyFox folder, and then drop the file in your `[firefox profile folder]\extensions\` folder.

# Credits

This extension started life as the sample code accompanying this MozillaZine Knowledge Base article: http://kb.mozillazine.org/Getting_started_with_extension_development
>>>>>>> parent of 8763a0c... First commit of TiddlyFox 2
