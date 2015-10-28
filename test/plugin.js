var expect = chai.expect;

describe("StateManager", function() {
    var sm;
    var noop = function() {};

    beforeEach(function() {
        sm = new StateManager();
    });

    afterEach(function() {
        sm.destroy();
    });

    describe("#register", function() {
        it("should be a function", function() {
            expect(sm.register).to.exist;
        });

        it("should create a new MediaQuery object", function() {
            var query = sm.register("screen and (max-width: 768px)", noop);
            expect(sm.queries.length).to.be.gt(0);
        });
    });

    describe("#deregister", function() {
        it("should be a function", function() {
            expect(sm.register).to.exist;
        });

        it("should remove a MediaQuery object", function() {
            var query = sm.register("screen and (max-width: 768px)", noop);
            sm.deregister(query);
            expect(sm.queries.length).to.equal(0);
        });
    });

    describe("#destroy", function() {
        it("should be a function", function() {
            expect(sm.register).to.exist;
        });
    });
});
