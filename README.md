# StateManager

[![Travis](https://img.shields.io/travis/lgraubner/state-manager.svg)](https://travis-ci.org/lgraubner/state-manager) [![David Dev](https://img.shields.io/david/dev/lgraubner/state-manager.svg)](https://david-dm.org/lgraubner/state-manager#info=devDependencies)

> Javascript handling for mediaquery breakpoints.

The StateManager plugin handles mediaqueries and executes javascript on match/unmatch. This plugin is inspired by enquire.js, but cut down on basic functionality and slightly different handling of callbacks (e.g. executing callback on register if mediaquery matches).

## Dependencies

None.

## Supported Browsers

StateManager relies on `window.matchMedia` for mediaquery checks which is supported by the following browsers:

* Chrome 10+
* Firefox 6+
* Safari 5.1+
* IE 10+

To support legacy browsers a [polyfill](https://github.com/paulirish/matchMedia.js) is required.

## Usage

Install it via NPM or download source.

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

### Basic

Initialize:

```JavaScript
var sm = new StateManager();
```

Add states:

```JavaScript
var handler = sm.register("screen and (max-width: 768px)", function() {
    // fires once if device viewport matches
});
```

remove states:

```JavaScript
sm.deregister(handler);
```

### Advanced

If your callback function depends on a specific context pass it on initialization:

```JavaScript
var context = {
    ...

    foo: function() {

    }
}

var sm = new StateManager(context);
```

To register callbacks for unmatching mediaqueries use the following declaration:

```JavaScript
var handler = sm.register("screen and (max-width: 768px)", function matchHandler() { ... }, function unmatchHandler() { ... });
```

In some cases you might need multiple callback functions. Therefore register arrays of functions:

```JavaScript
var handler = sm.register("screen and (max-width: 768px)", [
    function() { ... },
    function() { ... }
],
[
    function() { ... }
]);
```

You can also check for states beside the handlers. Each handler exposes a `matches` property which is `true` or `false`, depending of the mediaquery.

```JavaScript
var mobile = sm.register("screen and (max-width: 768px)"); // handlers are optional

console.log(mobile.matches); // true/false
```
