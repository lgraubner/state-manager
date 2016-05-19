/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */
/* globals chai:false, StateManager:false */
var expect = chai.expect;

describe('StateManager', function () {
  var sm;
  var noop = function () {};
  describe('QueryHandler', function () {
    describe('#register', function () {
      before(function () {
        sm = new StateManager();
      });

      after(function () {
        sm.destroy();
      });

      it('should be a function', function () {
        expect(sm.register).to.exist;
      });

      it('should create a new MediaQuery object', function () {
        sm.register('screen and (max-width: 768px)', noop);
        expect(sm.queries.length).not.to.be.empty;
      });

      it('should throw an error if first argument type is wrong', function () {
        function proxy() {
          sm.register(42, noop);
        }
        expect(proxy).to.throw(TypeError);
      });

      it('should throw an error if second argument type is wrong', function () {
        function proxy() {
          sm.register('screen and (max-width: 768px)', 42);
        }
        expect(proxy).to.throw(TypeError);
      });
    });

    describe('#deregister', function () {
      beforeEach(function () {
        sm = new StateManager();
      });

      afterEach(function () {
        sm.destroy();
      });

      it('should be a function', function () {
        expect(sm.register).to.exist;
      });

      it('should remove a MediaQuery object', function () {
        var query = sm.register('screen and (max-width: 768px)', noop);
        sm.deregister(query);
        expect(sm.queries.length).to.be.empty;
      });
    });

    describe('#matches', function () {
      before(function () {
        sm = new StateManager();
      });

      after(function () {
        sm.destroy();
      });

      it('should be a function', function () {
        expect(sm.matches).to.exist;
      });

      it('should return a boolean', function () {
        expect(sm.matches('screen and (max-width: 992px)')).to.be.oneOf([true, false]);
      });
    });

    describe('#destroy', function () {
      before(function () {
        sm = new StateManager();
      });

      after(function () {
        sm.destroy();
      });

      it('should be a function', function () {
        expect(sm.register).to.exist;
      });

      it('should remove all MediaQuery instances', function () {
        expect(sm.queries).to.be.empty;
      });
    });
  });

  describe('MediaQuery', function () {
    var query;

    before(function () {
      sm = new StateManager();
      query = sm.register('screen and (max-width: 768px)', noop);
    });

    after(function () {
      sm.destroy();
    });

    describe('Object', function () {
      it('should have use specified callback handler', function () {
        expect(query.handler).to.exist;
        expect(query.handler).to.equal(noop);
      });

      it('should have a listener function', function () {
        expect(query.listenerFunction).to.exist;
        expect(query.listenerFunction).to.be.a('function');
      });

      it('should have a matchMedia instance', function () {
        expect(query.matchMedia).to.exist;
      });

      it('should have a mediaquery string', function () {
        expect(query.mq).to.exist;
        expect(query.mq).to.be.a('string');
      });

      it('should return a boolean', function () {
        expect(query.matches).to.exist;
        expect(query.matches).to.be.a('boolean');
      });
    });
  });
});
