# StateManager
Javascript handling for breakpoints.

## Dependencies

* jQuery

## Usage


Initialize:

```JavaScript
var sm = new StateManager();
```

Initialize with breakpoints:

```JavaScript
var sm = new StateManager([
    {
        name: "mobile",
        maxWidth: 768,
        match: function() {

        },
        unmatch: function() {

        }
    },
    {
        name: "desktop",
        minWidth: 769,
        match: function() {

        },
        unmatch: function() {

        }
    }
]);
```

Add Breakpoints after initialization:

```JavaScript
sm.addState({
    {
        name: "tablet",
        minWidth: 768,
        maxWidth: 990,
        match: function() {

        },
        unmatch: function() {

        }
    }
});
```

### API

* addState
* matchState
* destroy
