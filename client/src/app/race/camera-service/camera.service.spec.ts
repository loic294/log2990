import { TestBed, inject } from "@angular/core/testing";

import { CameraService } from "./camera.service";
import { Car } from "../car/car";
import { Engine } from "../car/engine";

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("CameraService", () => {
    let car: Car;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });
        car = new Car(new MockEngine());
        await car.init();
        done();
    });

    it("should be created", inject([CameraService], (service: CameraService) => {
        // service = new CameraService(car, 1.5);
        expect(service).toBeTruthy();
    }));
});

describe("ThirdPersonCamera", () => {

    it("should be a proper distance behind upon creation.", () => {
    });

    it("should follow the car properly at the same distance as when it was created.", () => {

    });

});

describe("TopDownCamera", () => {

    it("should be a proper distance behind upon creation.");

    it("should follow the car properly at the same distance as when it was created.");

});
