 /* tslint:disable */ 
import Constraint, { createConstraints, intersects } from "./constraint";
import { Orientation } from "../../../../common/lexical/word";
import { assert } from "chai";

describe("Constraints", function() {
    describe("Intersections", function() {
        it("Should intersect at [0,0]", function() {
            const c1: Constraint = new Constraint("", "", [0, 0], Orientation.horizontal);
            c1.size = 6;
            const c2: Constraint = new Constraint("", "", [0, 0], Orientation.vertical);
            c2.size = 6;
            assert.equal(intersects(c1, c2).length, 2);
        });
        it("Should intersect at [1,1]", function() {
            const c1: Constraint = new Constraint("", "", [1, 0], Orientation.horizontal);
            c1.size = 2;
            const c2: Constraint = new Constraint("", "", [0, 1], Orientation.vertical);
            c2.size = 2;
            assert.equal(intersects(c1, c2).length, 2);
        });
        it("Should intersect at [1,1]", function() {
            const c1: Constraint = new Constraint("", "", [0, 1], Orientation.vertical);
            c1.size = 3;
            const c2: Constraint = new Constraint("", "", [1, 0], Orientation.horizontal);
            c2.size = 3;
            assert.equal(intersects(c1, c2).length, 2);
        });
        it("Should not intersect (both directions)", function() {
            const c1: Constraint = new Constraint("", "", [0, 1], Orientation.horizontal);
            c1.size = 4;
            const c2: Constraint = new Constraint("", "", [1, 0], Orientation.vertical);
            c2.size = 4;
            assert.equal(intersects(c1, c2).length, 0);
        });
        it("Should not intersect (horizontal)", function() {
            const c1: Constraint = new Constraint("", "", [0, 1], Orientation.horizontal);
            c1.size = 2;
            const c2: Constraint = new Constraint("", "", [0, 2], Orientation.horizontal);
            c2.size = 2;
            assert.equal(intersects(c1, c2).length, 0);
        });
        it("Should not intersect (vertical)", function() {
            const c1: Constraint = new Constraint("", "", [1, 0], Orientation.vertical);
            c1.size = 3;
            const c2: Constraint = new Constraint("", "", [2, 0], Orientation.vertical);
            c2.size = 3;
            assert.equal(intersects(c1, c2).length, 0);
        });
    });
    describe("Create Constraints From Words", function() {
        it("Should intersect at [0,0]", async function() {
            const c1: Constraint = new Constraint("test", "", [0, 0], Orientation.horizontal);
            c1.size = 4;
            const c2: Constraint = new Constraint("test", "", [0, 0], Orientation.vertical);
            c2.size = 4;

            const constraints: Array<Constraint> = await createConstraints([c1, c2]);
            assert.deepEqual(constraints[0].constraints, [ { wordIndex: 1, point: [ 0, 0 ] } ]);
            assert.deepEqual(constraints[1].constraints, [ { wordIndex: 0, point: [ 0, 0 ] } ]);
        });
        it("Should intersect at [2,2]", async function() {
            const c1: Constraint = new Constraint("test", "", [2, 2], Orientation.horizontal);
            c1.size = 6;
            const c2: Constraint = new Constraint("test", "", [0, 2], Orientation.vertical);
            c2.size = 6;

            const constraints: Array<Constraint> = await createConstraints([c1, c2]);
            assert.deepEqual(constraints[0].constraints, [ { wordIndex: 1, point: [ 2, 2 ] } ]);
            assert.deepEqual(constraints[1].constraints, [ { wordIndex: 0, point: [ 2, 2 ] } ]);
        });
        it("Should not intersect", async function() {
            const c1: Constraint = new Constraint("test", "", [0, 2], Orientation.horizontal);
            c1.size = 6;
            const c2: Constraint = new Constraint("test", "", [2, 0], Orientation.vertical);
            c2.size = 6;

            const constraints: Array<Constraint> = await createConstraints([c1, c2]);
            assert.deepEqual(constraints[0].constraints.length, 0);
            assert.deepEqual(constraints[1].constraints.length, 0);
        });
    });
});

