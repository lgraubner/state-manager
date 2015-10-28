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

To support legacy browsers a [polyfill](https://github.com/paulirish/matchMedia.js) is included in the minified `StateManager-polyfill.min.js` version.

## Usage

Include `StateManager.min.js` before the closing `body` tag.

```HTML
<script src="/path/to/StateManager.min.js"></script>
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
var handler = sm.register("screen and (max-width: 768px)", {
    match: function() {
        // fires once if mediaquery matches
    },
    unmatch: function() {
        // fires once if mediaquery does not match anymore
    }
});
```

In some cases you might need multiple callback functions. Therefore register an array of functions:

```JavaScript
var handler = sm.register("screen and (max-width: 768px)", {
    match: [func1() { ... }, func2() { ... }],
    unmatch: [func3() { ... }, func4() { ... }]
});
```
