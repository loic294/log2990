import { Vector3, Quaternion, Matrix4 } from "three";
import { Car } from "./car";

export default class Collision {

    public static detectCollision(carA: Car, carB: Car): boolean {
        return carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): Array<Vector3> {
        const resultSpeeds: Array<Vector3> = [];

        resultSpeeds.push(Collision.calculateSpeed(carA, carA.mass + carB.mass));
        resultSpeeds.push(Collision.calculateSpeed(carB, carA.mass + carB.mass));

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
