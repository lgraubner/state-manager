/**
 * Javascript handling for mediaquery breakpoints.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 4.1.2
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
     * Helper function to check if object is an array.
     *
     * @param  {Object}  obj object to check
     * @return {Boolean}
     */
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * Helper function to check if object is a function.
     *
     * @param  {Object}  obj object to check
     * @return {Boolean}
     */
    function isfunction(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    /**
     * Object representing a mediaquery.
     *
     * @param  {string} mq    plain mediaquery string
     * @param  {Object} handler callbacks to execute
     * @param  {Object} context context for the callbacks
     */
    function MediaQuery(mq, handler, context) {
      var self = this;

      this.mq = mq;
      this.handler = handler;
      this.context = context;

      this.matchMedia = window.matchMedia(mq);
      this.matches = this.matchMedia.matches;

      this.listenerFunction = function (mql) {
        self.matches = mql.matches;

        if (mql.matches) {
          self.matchCallback();
        } else {
          self.unmatchCallback();
        }
      };
      this.matchMedia.addListener(this.listenerFunction);

      if (this.matches) {
        this.matchCallback();
      }
    }

    /**
     * Executes callbacks if mediaquery matches.
     */
    MediaQuery.prototype.matchCallback = function () {
      var handler = this.handler;
      var self = this;

      if (isfunction(handler.match)) {
        handler.match.apply(this.context);
      }

      if (isArray(handler.match)) {
        each(handler.match, function (func) {
          if (isfunction(func)) {
            func.apply(self.context);
          }
        });
      }
    };

    /**
     * Executes callbacks if mediaquery does not match anymore.
     */
    MediaQuery.prototype.unmatchCallback = function () {
      var handler = this.handler;
      var self = this;

      if (isfunction(handler.unmatch)) {
        handler.unmatch.apply(this.context);
      }

      if (isArray(handler.unmatch)) {
        each(handler.unmatch, function (func) {
          if (isfunction(func)) {
            func.apply(self.context);
          }
        });
      }
    };

    /**
     * Destroys MediaQuery object and removes listener.
     */
    MediaQuery.prototype.destroy = function () {
      this.matchMedia.removeListener(this.listenerFunction);
      this.matchMedia = undefined;
      this.matches = undefined;
      this.context = undefined;
      this.mq = undefined;
      this.handler = undefined;
    };

    /**
     * Constructor for new StateManager instances.
     *
     * @param  {Object} context   context to execute callbacks in
     */
    function QueryHandler(context) {
      var err = 'matchMedia is not supported. Please visit: '
        + 'https://github.com/lgraubner/state-manager#supported-browsers';
      if (!window.matchMedia) {
        throw new Error(err);
      }

      this.queries = [];
      this.context = context || window;
    }

    /**
     * Creates new MediaQuery object.
     *
     * @param  {String} mq    plain mediaquery
     * @param  {Object} handler callback functions
     * @return {MediaQuery}   MediaQuery object
     */
    QueryHandler.prototype.register = function (mq, matchHandler, unmatchHandler) {
      var query = new MediaQuery(mq, {
        match: matchHandler,
        unmatch: unmatchHandler,
      }, this.context);
      this.queries.push(query);
      return query;
    };

    /**
     * Deletes MediaQuery object.
     * @param  {[type]} MediaQuery MediaQuery object
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
     * Destroys the StateManager and removes all MediaQuery objects and listeners.
     */
    QueryHandler.prototype.destroy = function () {
      var self = this;
      each(this.queries, function (mq) {
        self.deregister(mq);
      });

      this.context = undefined;
    };

    return QueryHandler;
  })(window);
}));
