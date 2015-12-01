var expect = chai.expect;

describe("StateManager", function() {
    var sm;
    var noop = function() {};

    describe("QueryHandler", function() {

        describe("Object", function() {
            it("should have a context", function() {
                sm = new StateManager();
                expect(sm.context).to.be.not.empty;
                sm.destroy();
            });
        });

        describe("#register", function() {

            before(function() {
                sm = new StateManager();
            });

            after(function() {
                sm.destroy();
            });

            it("should be a function", function() {
                expect(sm.register).to.exist;
            });

            it("should create a new MediaQuery object", function() {
                var query = sm.register("screen and (max-width: 768px)", noop);
                expect(sm.queries.length).not.to.be.empty;
            });
        });

        describe("#deregister", function() {

            before(function() {
                sm = new StateManager();
            });

            after(function() {
                sm.destroy();
            });

            it("should be a function", function() {
                expect(sm.register).to.exist;
            });

            it("should remove a MediaQuery object", function() {
                var query = sm.register("screen and (max-width: 768px)", noop);
                sm.deregister(query);
                expect(sm.queries.length).to.be.empty;
            });
        });

        describe("#destroy", function() {

            before(function() {
                sm = new StateManager();
            });

            after(function() {
                sm.destroy();
            });

            it("should be a function", function() {
                expect(sm.register).to.exist;
            });

            it("should remove context reference", function() {
                sm.destroy();
                expect(sm.context).to.be.undefined;
            });

            it("should remove all MediaQuery instances", function() {
                expect(sm.queries).to.be.empty;
            });
        });
    });

    describe("MediaQuery", function() {
        var query;

        before(function() {
            sm = new StateManager();
            query = sm.register("screen and (max-width: 768px)", noop, noop);
        });

        after(function() {
            sm.destroy();
        });

        describe("Object", function() {
            it("should inherit context", function() {
                expect(query.context).to.exist;
                expect(query.context).to.equal(sm.context);
            });

            it("should have a given match handler", function() {
                expect(query.handler.match).to.exist;
                expect(query.handler.match).to.equal(noop);
            });

            it("should have a given unmatch handler", function() {
                expect(query.handler.unmatch).to.exist;
                expect(query.handler.unmatch).to.equal(noop);
            });

            it("should have a listener function", function() {
                expect(query.listenerFunction).to.exist;
                expect(query.listenerFunction).to.be.a("function");
            });

            it("should have a matchMedia instance", function() {
                expect(query.matchMedia).to.exist;
            });

            it("should have a mediaquery string", function() {
                expect(query.mq).to.exist;
                expect(query.mq).to.be.a("string");
            });

            it("should return a boolean", function() {
                expect(query.matches).to.exist;
                expect(query.matches).to.be.a("boolean");
            });
        });
    });
});
