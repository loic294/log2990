import Constraint from "./Constraint";
import { Case } from "../../../../common/grid/case";
import {expect} from "chai";

describe("Constraint", () => {
    let expectedTestArray: Array<Array<Case>>;
    let actualTestArray: Array<Array<Case>>;
    let constraint: Constraint;
    const TEN: number = 10;

    it("should add the name of a specified word");

    it("should remove a specified word from its list.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "avian"]);
        expectedTestArray = [
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case(), new Case()],
        ];

        expect(expectedTestArray).to.eql(actualTestArray);

    });
});
