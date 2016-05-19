/**
 * Javascript handling for mediaquery breakpoints.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 5.0.0
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.StateManager = factory();
  }
}(this, function () {
  return (function (window) {
    /**
     * Helper function to iterate over an array.
     *
     * @param  {Array}  arr array to iterate over
     * @param  {Function} fn  callback function
     */
    function each(arr, fn) {
      var i;
      for (i = 0; i < arr.length; i++) {
        fn(arr[i], i);
      }
    }

    /**
     * Helper function to check if object is a function.
     *
     * @param  {Object}  obj object to check
     * @return {Boolean}
     */
    function isFunction(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    /**
     * Object representing a mediaquery.
     *
     * @param  {string} mq    plain mediaquery string
     * @param  {Object} handler callbacks to execute
     */
    function MediaQuery(mq, handler) {
      var self = this;

      this.mq = mq;
      this.handler = handler;

      this.matchMedia = window.matchMedia(mq);
      this.matches = this.matchMedia.matches;

      this.listenerFunction = function (mql) {
        self.matches = mql.matches;
        self.executeCallback();
      };

      this.matchMedia.addListener(this.listenerFunction);
      this.executeCallback();
    }

    /**
     * Executes callback if mediaquery matches/unmatches.
     */
    MediaQuery.prototype.executeCallback = function () {
      var handler = this.handler;

      if (isFunction(handler)) {
        handler.call(this, this.matches);
      }
    };

    /**
     * Destroys MediaQuery object and removes listener.
     */
    MediaQuery.prototype.destroy = function () {
      this.matchMedia.removeListener(this.listenerFunction);
      this.matchMedia = undefined;
      this.matches = undefined;
      this.mq = undefined;
      this.handler = undefined;
    };

    /**
     * Constructor for new StateManager instances.
     */
    function QueryHandler() {
      var err = 'matchMedia is not supported. Please visit: '
        + 'https://github.com/lgraubner/state-manager#supported-browsers';
      if (!window.matchMedia) {
        throw new Error(err);
      }

      this.queries = [];
    }

    /**
     * Creates new MediaQuery object.
     *
     * @param  {String} mq    plain mediaquery
     * @param  {Object} handler callback functions
     * @return {MediaQuery}   MediaQuery object
     */
    QueryHandler.prototype.register = function (mq, handler) {
      var query;

      if (typeof mq !== 'string') {
        throw new TypeError('A mediaquery string is required.');
      }

      if (!isFunction(handler)) {
        throw new TypeError('An handler function is required.');
      }

      query = new MediaQuery(mq, handler);
      this.queries.push(query);
      return query;
    };

    /**
     * Deletes MediaQuery object.
     *
     * @param  {MediaQuery} MediaQuery object
     */
    QueryHandler.prototype.deregister = function (query) {
      var queries = [];
      query.destroy();

      each(this.queries, function (mq) {
        if (mq !== query) {
          queries.push(mq);
        }
      });
      this.queries = queries;
    };

    /**
     * Checks if a mediaquery string matches.
     *
     * @param  {MediaQuery} mq  MediaQuery handler
     * @return {Boolean}        matches mq
     */
    QueryHandler.prototype.matches = function (mq) {
      return window.matchMedia(mq).matches;
    };

    /**
     * Destroys the StateManager and removes all MediaQuery objects and listeners.
     */
    QueryHandler.prototype.destroy = function () {
      var self = this;
      each(this.queries, function (mq) {
        self.deregister(mq);
      });
    };

    return QueryHandler;
  }(window));
}));
