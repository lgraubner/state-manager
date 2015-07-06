/**
 * Javascript handling for mediaquery breakpoints.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 2.0.2
 */

var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _states = [],
        _activeStates = [],
        $win, removeItem, match, inArray;

    /**
     * Debounce function to delay function calls.
     *
     * @param  {Function} func      function to call
     * @param  {number} wait        delay in milliseconds
     * @param  {boolean} immediate
     */
    var _debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /**
     * Triggers all matching states.
     */
    var _triggerStates = function() {
        $.each(_states, function(key, state) {
            match = _match(state);
            inArray = matchState(state.name);

            if (!inArray && match) {
                if (state.match) state.match.call(window);

                _activeStates.push(state.name);
            } else if (inArray && !match) {
                if (state.unmatch) state.unmatch.call(window);

                removeItem = state.name;
                _activeStates = $.grep(_activeStates, function(val) {
                    return val != removeItem;
                });
            }
        });
    };

    /**
     * Checks if given state matches.
     *
     * @param  {Object} state   state object
     * @return {boolean}        matches
     */
    var _match = function(state) {
        return window.matchMedia(state.mq).matches;
    };

    /**
     * Checks if a state is currently active.
     *
     * @param  {string} stateName   name of the state
     * @return {boolean}            matches
     */
    var matchState = function(stateName) {
        return $.inArray(stateName, _activeStates) === -1 ? false : true;
    };

    /**
     * Adds state object to check for matches.
     *
     * @param  {Object} state state object
     */
    var addState = function(state) {
        _states.push(state);
        _triggerStates();
    };

    /**
     * Destroys the StateManager and removes all States and EventListeners.
     */
    var destroy = function() {
        $win.off("resize.sm");
        _states = [];
        _activeStates = [];
    };

    /**
     * Constructor for new StateManager instances.
     *
     * @param  {Array} states   Array of states
     */
    var Plugin = function(states) {
        if (!window.matchMedia) return console.error("Function matchMedia not supported. Please visit: https://github.com/lgraubner/state-manager#supported-browsers");

        $win = $(window);

        if (states) {
            $.each(states, function(key, state) {
                addState(state);
            });

            _triggerStates();
        }

        $win.on("resize.sm", _debounce(_triggerStates, 100));
    };

    Plugin.prototype = {
        addState: addState,
        matchState: matchState,
        destroy: destroy
    };

    return Plugin;

})(this, document, jQuery);
