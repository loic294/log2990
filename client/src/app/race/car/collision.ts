import { Vector3, Matrix4, Mesh, Raycaster, Intersection } from "three";
import { Car } from "./car";

const ABSOLUTE_CAR_LENGTH_X: number = -0.7128778274977209;
const ABSOLUTE_CAR_LENGTH_Y: number = -0.007726105637907718;
const ABSOLUTE_CAR_LENGTH_Z: number = -1.8093634648776054;
const COLLISION_MULTIPLIER: number = 12;

export default class Collision {
    private static corners: Vector3[];

    public static detectCollision(firstCar: Car, secondCar: Car): boolean {
        return firstCar.boundingBox.intersectsBox(secondCar.boundingBox);
    }

    public static detectOutOfBounds(car: Car, track: Mesh[]): Vector3 {
        Collision.initializeCorners();

        for (const corner of Collision.corners) {
            const globalVertex: Vector3 = corner.applyMatrix4(car.mesh.matrix);
            const directionVector: Vector3 = globalVertex.sub(car.boundingBox.getCenter());
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), directionVector.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);
            if (collisionResults.length <= 0) {
                return Collision.collideOutOfBounds(car);
            }
        }

        return null;

    }

    private static collideOutOfBounds(car: Car): Vector3 {
        return car.speed.negate().normalize().multiplyScalar(COLLISION_MULTIPLIER);
    }

    private static initializeCorners(): void {
        Collision.corners = [];
        Collision.corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
    }

    public static collide(carA: Car, carB: Car): Array<Vector3> {
        const resultSpeeds: Array<Vector3> = [];

        resultSpeeds.push(Collision.calculateSpeed(carB, carA.mass + carB.mass));
        resultSpeeds.push(Collision.calculateSpeed(carA, carA.mass + carB.mass));

        return resultSpeeds;
    }

    private static calculateSpeed(car: Car, combinedMasses: number): Vector3 {
        return Collision.calculateMomentum(car).multiplyScalar(2).divideScalar(combinedMasses);
    }

    private static calculateMomentum(car: Car): Vector3 {
        return Collision.calculateMatrixedSpeed(car).multiplyScalar(car.mass);
    }

    private static calculateMatrixedSpeed(car: Car): Vector3 {
        return car.speed.applyMatrix4(new Matrix4().extractRotation(car.mesh.matrix));
    }
}
