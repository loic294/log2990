import { Vector3, Quaternion, Matrix4 } from "three";
import { Car } from "./car";

export default class Collision {
    private static carA: Car;
    private static carB: Car;

    public static detectCollision(carA: Car, carB: Car): boolean {
        return carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): Array<Vector3> {
        this.carA = carA;
        this.carB = carB;

        const speedA0: Vector3 = carA.speed;
        const speedB0: Vector3 = carB.speed;
        const mA: number = carA.mass;
        const mB: number = carB.mass;
        const mAB: number = mA + mB;

        Collision.applyMatrix(carA, carB, speedA0, speedB0);

        const momentumA: Vector3 = speedA0.multiplyScalar(mA);
        const momentumB: Vector3 = speedB0.multiplyScalar(mB);
        const speedA: Vector3 = momentumB.multiplyScalar(2).divideScalar(mAB);
        const speedB: Vector3 = momentumA.multiplyScalar(2).divideScalar(mAB);

        const resultSpeeds: Array<Vector3> = [];

        resultSpeeds.push(speedA);
        resultSpeeds.push(speedB);

        return resultSpeeds;
    }

    private static applyMatrix (carA: Car, carB: Car, vA: Vector3, vB: Vector3): void {
        const rotationMatrixA: Matrix4 = new Matrix4();
        const rotationMatrixB: Matrix4 = new Matrix4();
        rotationMatrixA.extractRotation(carA.mesh.matrix);
        rotationMatrixB.extractRotation(carB.mesh.matrix);
        const rotationQuaternionA: Quaternion = new Quaternion();
        const rotationQuaternionB: Quaternion = new Quaternion();
        rotationQuaternionA.setFromRotationMatrix(rotationMatrixA);
        rotationQuaternionB.setFromRotationMatrix(rotationMatrixB);

        const array: Array<Quaternion> = new Array();
        array.push(rotationQuaternionA);
        array.push(rotationQuaternionB);
        vA.applyMatrix4(rotationMatrixA);
        vB.applyMatrix4(rotationMatrixB);
    }
}
