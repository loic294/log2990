import { TestBed, inject } from "@angular/core/testing";

import { CameraService } from "./camera.service";
import { Car } from "../car/car";
import { Engine } from "../car/engine";
import { OrthographicCamera } from "three";

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

const MS_BETWEEN_FRAMES: number = 16.666;

describe("CameraService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });

    });

    it("should be created", inject([CameraService], (cameraService: CameraService) => {
        expect(cameraService).toBeTruthy();
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

    it("should be a proper distance behind upon creation.", inject([CameraService], (cameraService: CameraService) => {
        cameraService.initialize(car, aspectRatio);
        cameraService.followCar();
        const offsetX: number = car.meshPosition.x - cameraService.camera.position.x;
        const offsetZ: number = car.meshPosition.z - cameraService.camera.position.z;
        const offsetY: number = cameraService.camera.position.y - car.meshPosition.y;

        expect(offsetX).toBeLessThan(0);
        expect(offsetZ).toBeLessThan(0);
        expect(offsetY).toBeGreaterThan(0);
    }));

    it("should follow the car properly at the same distance as when it was created.",
       inject([CameraService], (cameraService: CameraService) => {
            cameraService.initialize(car, aspectRatio);
            cameraService.followCar();
            const offsetX: number = car.meshPosition.x - cameraService.camera.position.x;
            const offsetZ: number = car.meshPosition.z - cameraService.camera.position.z;
            const offsetY: number = cameraService.camera.position.y - car.meshPosition.y;

            car.isAcceleratorPressed = true;
            car.update(MS_BETWEEN_FRAMES);
            car.isAcceleratorPressed = false;
            car.isAcceleratorPressed = true;
            car.update(MS_BETWEEN_FRAMES);
            car.isAcceleratorPressed = false;

            cameraService.followCar();
            const offsetX2: number = car.meshPosition.x - cameraService.camera.position.x;
            const offsetZ2: number = car.meshPosition.z - cameraService.camera.position.z;
            const offsetY2: number = cameraService.camera.position.y - car.meshPosition.y;

            expect(offsetX2).toBe(offsetX);
            expect(offsetY2).toBe(offsetY);
            expect(offsetZ2).toBe(offsetZ);

        }));

    it("zoom should modify the distance of the camera ", inject([CameraService], (cameraService: CameraService) => {
        cameraService.initialize(car, aspectRatio);
        cameraService.followCar();
        const offsetX: number = Math.abs(car.meshPosition.x - cameraService.camera.position.x);
        const offsetZ: number = Math.abs(car.meshPosition.z - cameraService.camera.position.z);
        const offsetY: number = Math.abs(cameraService.camera.position.y - car.meshPosition.y);

        cameraService.zoom(true);
        cameraService.followCar();

        let offsetX2: number = Math.abs(car.meshPosition.x - cameraService.camera.position.x);
        let offsetZ2: number = Math.abs(car.meshPosition.z - cameraService.camera.position.z);
        let offsetY2: number = Math.abs(cameraService.camera.position.y - car.meshPosition.y);

        expect(offsetX2).toBeLessThan(offsetX);
        expect(offsetY2).toBeLessThan(offsetY);
        expect(offsetZ2).toBeLessThan(offsetZ);

        cameraService.zoom(false);
        cameraService.zoom(false);

        cameraService.followCar();

        offsetX2 = Math.abs(car.meshPosition.x - cameraService.camera.position.x);
        offsetZ2 = Math.abs(car.meshPosition.z - cameraService.camera.position.z);
        offsetY2 = Math.abs(cameraService.camera.position.y - car.meshPosition.y);

        expect(offsetX2).toBeGreaterThan(offsetX);
        expect(offsetY2).toBeGreaterThan(offsetY);
        expect(offsetZ2).toBeGreaterThan(offsetZ);
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

    it("should be a proper distance behind upon creation.", inject([CameraService], (cameraService: CameraService) => {
        cameraService.initialize(car, aspectRatio);
        cameraService.changeCamera();
        cameraService.followCar();
        const offsetY: number = cameraService.camera.position.y - car.meshPosition.y;

        expect(cameraService.camera.position.x).toBe(car.meshPosition.x);
        expect(cameraService.camera.position.z).toBe(car.meshPosition.z);
        expect(offsetY).toBeGreaterThan(0);
    }));

    it("should follow the car properly at the same distance as when it was created.",
       inject([CameraService], (cameraService: CameraService) => {
        cameraService.initialize(car, aspectRatio);
        cameraService.changeCamera();
        cameraService.followCar();
        const offsetY: number = cameraService.camera.position.y - car.meshPosition.y;

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        cameraService.followCar();
        const offsetY2: number = cameraService.camera.position.y - car.meshPosition.y;

        expect(offsetY2).toBe(offsetY);
        expect(cameraService.camera.position.x).toBe(car.meshPosition.x);
        expect(cameraService.camera.position.z).toBe(car.meshPosition.z);

    }));

    it("zoom should modify the distance of the camera ", inject([CameraService], (cameraService: CameraService) => {
        cameraService.initialize(car, aspectRatio);
        cameraService.followCar();
        cameraService.changeCamera();
        const camera: OrthographicCamera = cameraService.camera as OrthographicCamera;

        const initialZoom: number = camera.zoom;
        cameraService.zoom(true);
        cameraService.followCar();

        expect(camera.zoom).toBeGreaterThan(initialZoom);

        cameraService.zoom(false);
        cameraService.zoom(false);

        cameraService.followCar();

        expect(camera.zoom).toBeLessThan(initialZoom);
    }));
});
