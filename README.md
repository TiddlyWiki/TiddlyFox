# Introduction

TiddlyWiki for Firefox is an add-on that enables [http://tiddlywiki.com](TiddlyWiki) to save changes directly to the filing system.

If you are an end user then you don't need to use this repository; you should install the latest released version of TiddlyWiki for Firefox via the Mozilla Add-on library:

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

To use Firefox Developer Edition:

```
cd {tiddlywiki for firefox directory}
jpm run -b "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox"
```

To build the TiddlyWiki for Firefox XPI file:

```
cd {tiddlywiki for firefox directory}
jpm xpi
```
