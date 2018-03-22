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

const MS_BETWEEN_FRAMES: number = 16.666;

describe("CameraService", () => {
    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });

    });

    it("should be created", inject([CameraService], (service: CameraService) => {
        expect(service).toBeTruthy();
    }));
});

describe("ThirdPersonCamera", () => {
    let car: Car;
    const aspectRatio: number = 2.4;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });
        car = new Car(new MockEngine());
        await car.init();
        car.update(MS_BETWEEN_FRAMES);
        done();
    });

    it("should be a proper distance behind upon creation.", inject([CameraService], (service: CameraService) => {
        service.initialize(car, aspectRatio);
        service.follow();
        const offsetX: number = car.meshPosition.x - service.camera.position.x;
        const offsetZ: number = car.meshPosition.z - service.camera.position.z;
        const offsetY: number = service.camera.position.y - car.meshPosition.y;
        expect(offsetX).toBeLessThan(0);
        expect(offsetZ).toBeLessThan(0);

        expect(offsetY).toBeGreaterThan(0);
    }));

    it("should follow the car properly at the same distance as when it was created.", inject([CameraService], (service: CameraService) => {
        service.initialize(car, aspectRatio);
        service.follow();
        const offsetX: number = car.meshPosition.x - service.camera.position.x;
        const offsetZ: number = car.meshPosition.z - service.camera.position.z;
        const offsetY: number = service.camera.position.y - car.meshPosition.y;

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        service.follow();
        const offsetX2: number = car.meshPosition.x - service.camera.position.x;
        const offsetZ2: number = car.meshPosition.z - service.camera.position.z;
        const offsetY2: number = service.camera.position.y - car.meshPosition.y;

        expect(offsetY2).toBe(offsetY);
        expect(offsetX2).toBe(offsetX);
        expect(offsetZ2).toBe(offsetZ);

    }));

});

describe("TopDownCamera", () => {
    let car: Car;
    const aspectRatio: number = 2.4;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });
        car = new Car(new MockEngine());
        await car.init();
        car.update(MS_BETWEEN_FRAMES);
        done();
    });

    it("should be a proper distance behind upon creation.", inject([CameraService], (service: CameraService) => {
        service.initialize(car, aspectRatio);
        service.changeCamera();
        service.follow();
        const offsetY: number = service.camera.position.y - car.meshPosition.y;

        expect(service.camera.position.x).toBe(car.meshPosition.x);
        expect(service.camera.position.z).toBe(car.meshPosition.z);
        expect(offsetY).toBeGreaterThan(0);
    }));

    it("should follow the car properly at the same distance as when it was created.", inject([CameraService], (service: CameraService) => {
        service.initialize(car, aspectRatio);
        service.changeCamera();
        service.follow();
        const offsetY: number = service.camera.position.y - car.meshPosition.y;

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        service.follow();
        const offsetY2: number = service.camera.position.y - car.meshPosition.y;

        expect(offsetY2).toBe(offsetY);
        expect(service.camera.position.x).toBe(car.meshPosition.x);
        expect(service.camera.position.z).toBe(car.meshPosition.z);

    }));
});
