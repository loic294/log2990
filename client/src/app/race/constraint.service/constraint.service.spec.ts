// tslint:disable:no-magic-numbers
import { TestBed, inject } from "@angular/core/testing";

import { ConstraintService } from "./constraint.service";
import { Vector2 } from "three";

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
        const vectorA: Vector2 = new Vector2(0, 100);
        const vectorB: Vector2 = new Vector2(100, 0);

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(90);
    }));

    it("should generate an angle of 45 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(0, 100);
        const vectorB: Vector2 = new Vector2(100, 100);

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(45);
    }));

    it("should generate an angle of 180 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(100, 0);
        const vectorB: Vector2 = new Vector2(-100, 0);

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(180);
    }));

    it("should generate an angle of 135 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(100, -100);
        const vectorB: Vector2 = new Vector2(-100, 0);

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(135);
    }));

    it("should generate an angle of 11.30993247402021 degres", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(0, 100);
        const vectorB: Vector2 = new Vector2(20, 100);

        expect(service.getAngleOfTwoVectors(vectorA, vectorB)).toEqual(11.30993247402021);
    }));

    it("should validate 45 degres angle", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(0, 100);
        const vectorB: Vector2 = new Vector2(100, 100);

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(false);
    }));

    it("should validate 225 degres angle", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(100, -100);
        const vectorB: Vector2 = new Vector2(-100, 0);

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(true);
    }));

    it("should fail 11.30993247402021 degres validation", inject([ConstraintService], (service: ConstraintService) => {
        const vectorA: Vector2 = new Vector2(0, 100);
        const vectorB: Vector2 = new Vector2(20, 100);

        expect(service.checkIfAngleIsValid(service.getAngleOfTwoVectors(vectorA, vectorB))).toEqual(false);
    }));

    it("should fail if distance is of 6", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 6;

        expect(service.checkDistance(distance)).toEqual(true);
    }));

    it("should fail if distance of 15.99999", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 15.99999;

        expect(service.checkDistance(distance)).toEqual(false);
    }));

    it("should pass if distance of 16", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 16;

        expect(service.checkDistance(distance)).toEqual(false);
    }));

    it("should pass if distance of  29484.299229", inject([ConstraintService], (service: ConstraintService) => {
        const distance: number = 29484.299229;

        expect(service.checkDistance(distance)).toEqual(false);
    }));

    it("should not intersect because they are parrallel", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: Vector2 = new Vector2(0, 0);
        const vertexB: Vector2 = new Vector2(0, 100);
        const vertexC: Vector2 = new Vector2(20, 0);
        const vertexD: Vector2 = new Vector2(20, 100);

        expect(service.intersects(vertexA, vertexB, vertexC, vertexD)).toEqual(false);
    }));

    it("should intersect because they cross at 45 degre angle", inject([ConstraintService], (service: ConstraintService) => {
        const vertexA: Vector2 = new Vector2(0, 0);
        const vertexB: Vector2 = new Vector2(100, 100);
        const vertexC: Vector2 = new Vector2(100, 0);
        const vertexD: Vector2 = new Vector2(0, 100);

        expect(service.intersects(vertexA, vertexB, vertexC, vertexD)).toEqual(true);
    }));

});
