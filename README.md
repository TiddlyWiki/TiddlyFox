# Introduction

TiddlyWiki for Firefox is an add-on that enables [http://tiddlywiki.com](TiddlyWiki) to save changes directly to the filing system.

If you are an end user then you don't this repository; you should install TiddlyWiki for Firefox via the Mozilla Add-on library:

https://addons.mozilla.org/en-US/firefox/addon/tiddlyfox/

# Development Prerequisites

Install the jpm, the Firefox Add-on SDK:

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
