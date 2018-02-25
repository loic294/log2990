import { TestBed, inject } from "@angular/core/testing";

import { ConstraintService } from "./constraint.service";

interface VectorI {
    x: number;
    y: number;
}

describe("ConstraintService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [ConstraintService]
        });
    });

    it("should convert an angle of 1.5707963267948966 rad to 90 degres", inject([ConstraintService], (service: ConstraintService) => {
        expect(service.converteToDegre(1.5707963267948966)).toEqual(90);
    }));

    it("should generate an angle of 90 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 0, y: 100 };
        const vectorB: VectorI = { x: 100, y: 0 };

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(90);
    }));

    it("should generate an angle of 45 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 0, y: 100 };
        const vectorB: VectorI = { x: 100, y: 100 };

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(45);
    }));

    it("should generate an angle of 180 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 100, y: 0 };
        const vectorB: VectorI = { x: -100, y: 0 };

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(180);
    }));

    it("should generate an angle of 225 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 100, y: -100 };
        const vectorB: VectorI = { x: -100, y: 0 };

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(225);
    }));

    it("should generate an angle of 11.30993247402021 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 0, y: 100 };
        const vectorB: VectorI = { x: 20, y: 100 };

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(11.30993247402021);
    }));

    it("should validate 45 degres angle", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 0, y: 100 };
        const vectorB: VectorI = { x: 100, y: 100 };

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(true);
    }));

    it("should validate 225 degres angle", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 100, y: -100 };
        const vectorB: VectorI = { x: -100, y: 0 };

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(true);
    }));

    it("should fail 11.30993247402021 degres validation", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: VectorI = { x: 0, y: 100 };
        const vectorB: VectorI = { x: 20, y: 100 };

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(false);
    }));

});
