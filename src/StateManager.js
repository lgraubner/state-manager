/**
 * Javascript handling for mediaquery breakpoints.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 3.1.0
 */

var StateManager = (function(window, document, $, undefined) {
    "use strict";

    var _states = [];
    var _activeStates = [];
    var _context;
    var $win;

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
            var context = this;
            var args = arguments;
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
     * Generates a random five character key
     *
     * @return {String} key
     */
    var _generateKey = function() {
        var key = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var i;

        for(i = 0; i < 5; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return key;
    };

    /**
     * Triggers a single state.
     */
    var _triggerState = function(state) {
        var mq = state.mq;
        var handler = state.handler;

        var matches = _matches(mq);
        var active = _isActive(state);

        if (!active && matches) {
            if ($.isFunction(handler)) {
                handler.apply(_context);
            }

            if ($.isFunction(handler.match)) {
                handler.match.apply(_context);
            }

            if ($.isArray(handler.match)) {
                $.each(handler.match, function() {
                    this.apply(_context);
                });
            }

            _activeStates.push(state.key);
        } else if (active && !matches) {
            if ($.isFunction(handler.unmatch)) {
                handler.unmatch.apply(_context);
            }

            if ($.isArray(handler.unmatch)) {
                $.each(handler.unmatch, function() {
                    this.apply(_context);
                });
            }

            _activeStates = $.grep(_activeStates, function(val) {
                return val != state.key;
            });
        }
    };

    /**
     * Triggers all matching states.
     */
    var _triggerAllStates = function() {
        $.each(_states, function(key, state) {
            _triggerState(state);
        });
    };

    /**
     * Checks if a state is currently active.
     *
     * @param  {Object}  state  state object
     * @return {boolean}        match result
     */
    var _isActive = function(state) {
        return $.inArray(state.key, _activeStates) === -1 ? false : true;
    };

    /**
     * Checks if given state matches.
     *
     * @param  {String} mq      media query
     * @return {boolean}        matches
     */
    var _matches = function(mq) {
        return window.matchMedia(mq).matches;
    };

    /**
     * Adds a state object to check for matches.
     *
     * @param  {Object} state   state object
     * @param  {mixed}  handler object or function with callbacks
     */
    var register = function(state, handler) {
        var stateObj = {
            key: _generateKey(),
            mq: state,
            handler: handler
        };

        _states.push(stateObj);
        _triggerState(stateObj);

        return stateObj;
    };

    var deregister = function(state) {
        _activeStates = $.grep(_activeStates, function(val) {
            return val != state.key;
        });

        _states = $.grep(_states, function(val) {
            return val.key != state.key;
        });
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
     * @param  {Object} context   context to execute callbacks in
     */
    var Plugin = function(context) {
        if (!window.matchMedia) {
            throw new Error("matchMedia is not supported. Please visit: https://github.com/lgraubner/state-manager#supported-browsers");
        }

        _context = context || this;
        $win = $(window);

        $win.on("resize.sm", _debounce(_triggerAllStates, 100));
    };

    Plugin.prototype = {
        register: register,
        deregister: deregister,
        destroy: destroy
    };

    return Plugin;

})(this, document, jQuery);
