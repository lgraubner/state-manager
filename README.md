___
🚧 DEPRECATED - This repository is deprecated in favor of [mqr](https://github.com/lgraubner/mqr) and will not be updated anymore. Use at your own risk.
___

# StateManager

[![Travis](https://img.shields.io/travis/lgraubner/state-manager.svg)](https://travis-ci.org/lgraubner/state-manager) [![David Dev](https://img.shields.io/david/dev/lgraubner/state-manager.svg)](https://david-dm.org/lgraubner/state-manager#info=devDependencies) [![npm](https://img.shields.io/npm/v/responsive-state-manager.svg)](https://www.npmjs.com/package/responsive-state-manager)

> Javascript handling for mediaquery breakpoints.

This small library is a wrapper for `matchMedia` and `matchMedia.listen` to easily deal with Media Queries in Javascript.

## Dependencies

None.

## Supported Browsers

StateManager relies on `window.matchMedia` for Media Query checks which is supported by the following browsers:

* Chrome 10+
* Firefox 6+
* Safari 5.1+
* IE 10+

To support legacy browsers a [polyfill](https://github.com/paulirish/matchMedia.js) is required.

## Installation

Install it via npm or download the source directly.

```Bash
npm install responsive-state-manager --save
```

**Classic**

Include `StateManager.min.js` before the closing `body` tag.

```HTML
<script src="node_modules/responsive-state-manager/dist/StateManager.min.js"></script>
```

**CommonJS**

```JavaScript
var StateManager = require("responsive-state-manager");
```

## Usage

Initialize it:

```JavaScript
var sm = new StateManager();
```

### `.register()`

Registers a listener for a Media Query. The callback function is triggered every time the breakpoint is passed and the state changes. Additionally the callback is triggered when the Listener gets registered. The suplied argument is `true` or `false` depending on whether the Media Query matches.
It returns a reference to the Listener Object.

```JavaScript
var handler = sm.register("screen and (max-width: 768px)", function (matches) {
    // fires on register and every time the state changes
    if (matches) {
        // Media Query matches
    } else {
        // Media Query doesn't match
    }
});
```

### `.deregister()`

Deregisters an attached listener. Accepts a reference to a listener Object.

```JavaScript
sm.deregister(handler);
```

### `.matches()`

You can also check directly if a media query matches.

```JavaScript
var mobile = sm.matches("screen and (max-width: 768px)"); // does not attach listener

console.log(mobile); // true/false
```
