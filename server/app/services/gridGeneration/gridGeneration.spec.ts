import GridGeneration from "./gridGeneration";
import { Case } from "../../../../common/grid/case";
import {expect} from "chai";

describe("GridGenerator", () => {
    let expectedTestArray: Array<Array<Case>>;
    let actualTestArray: Array<Array<Case>>;
    const gridGeneration: GridGeneration =  new GridGeneration();
    const TEN: number = 10;

    it("should create a 10x10 empty array of cases", () => {
        actualTestArray = gridGeneration.fillGridWithCases(TEN);
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
