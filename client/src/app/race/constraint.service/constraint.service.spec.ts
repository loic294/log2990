// tslint:disable:no-magic-numbers
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

    it("should send a distance of 100", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: VectorI = { x: 0, y: 100 };
        const vertexB: VectorI = { x: 0, y: 0 };

        expect(service.distance(vertexA, vertexB)).toEqual(100);
    }));

    it("should send a distance of 141.4213562373095", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: VectorI = { x: 0, y: 100 };
        const vertexB: VectorI = { x: 100, y: 0 };

        expect(service.distance(vertexA, vertexB)).toEqual(141.4213562373095);
    }));

    it("should distance of 6 should fail validation", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 6;

        expect(service.checkDistance(distance)).toEqual(false);
    }));

    it("should distance of 15.99999 should fail validation", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 15.99999;

        expect(service.checkDistance(distance)).toEqual(false);
    }));

    it("should distance of 16 should pass validation", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 16;

        expect(service.checkDistance(distance)).toEqual(true);
    }));

    it("should distance of 29484.299229 should pass validation", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 29484.299229;

        expect(service.checkDistance(distance)).toEqual(true);
    }));

    it("should not intersect because they are parrallel", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: VectorI = { x: 0, y: 0 };
        const vertexB: VectorI = { x: 0, y: 100 };
        const vertexC: VectorI = { x: 20, y: 0 };
        const vertexD: VectorI = { x: 20, y: 100 };

        expect(service.intersects(vertexA, vertexB, vertexC, vertexD)).toEqual(false);
    }));

    it("should intersect because they cross at 45 degre angle", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: VectorI = { x: 0, y: 0 };
        const vertexB: VectorI = { x: 100, y: 100 };
        const vertexC: VectorI = { x: 100, y: 0 };
        const vertexD: VectorI = { x: 0, y: 100 };

        expect(service.intersects(vertexA, vertexB, vertexC, vertexD)).toEqual(true);
    }));

});
