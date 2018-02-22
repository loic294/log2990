import { Car } from "./car";
import { Engine } from "./engine";
import Collision from "./collision";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Collision", () => {
    let carA: Car;
    let carB: Car;

    beforeEach(async (done: () => void) => {
        carA = new Car(new MockEngine());
        carB = new Car(new MockEngine());
        await carA.init();
        await carB.init();

        carA.isAcceleratorPressed = true;
        carA.update(MS_BETWEEN_FRAMES);
        carA.isAcceleratorPressed = false;
        carB.isAcceleratorPressed = true;
        carB.update(MS_BETWEEN_FRAMES);
        carB.isAcceleratorPressed = false;
        done();
    });

    it("should detect a collision with two identical cars.", () => {
        carB.isAcceleratorPressed = true;
        carB.update(MS_BETWEEN_FRAMES);
        carB.isAcceleratorPressed = false;

        expect(Collision.checkCollision(carA, carB)).toBe(true);
    });

    it("should detect a collision when two cars drive into each other.");

    it("should modify the speeds properly?.");
});
