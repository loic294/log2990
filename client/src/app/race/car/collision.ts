import { Vector3, Raycaster, Intersection, Box3, BoxGeometry, Geometry, Quaternion } from "three";
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

        const momentumA: Vector3 = speedA0.multiplyScalar(mA);
        const momentumB: Vector3 = speedB0.multiplyScalar(mB);
        const speedA: Vector3 = momentumB.multiplyScalar(2).divideScalar(mAB);
        const speedB: Vector3 = momentumA.multiplyScalar(2).divideScalar(mAB);

        const resultSpeeds: Array<Vector3> = [];

        resultSpeeds.push(speedA);
        resultSpeeds.push(speedB);

        return resultSpeeds;
    }

    public static collide2(carA: Car, carB: Car): Array<Vector3> {
        this.carA = carA;
        this.carB = carB;

        const resultSpeeds: Array<Vector3> = [];
        resultSpeeds.push(Collision.calculateSpeedForB());
        resultSpeeds.push(Collision.calculateSpeedForA());

        return resultSpeeds;
    }

    private static calculateNormalVector(): Vector3 {
        return new Vector3().addVectors(Collision.getCenter(this.carA), Collision.getCenter(this.carB)).normalize();
    }

    private static getCenter(car: Car): Vector3 {
        return car.boundingBox.getCenter();
    }

    private static calculateSpeedARelativeToBReferentialO(): Vector3 {
        return new Vector3().addVectors(this.carA.speed, this.carB.speed.negate());
    }

    private static projectSpeedARelativeToBOnNormalReferentialO(): number {
        return Collision.calculateSpeedARelativeToBReferentialO().dot(Collision.calculateNormalVector());
    }

    private static divideMasses(car1: Car, car2: Car): number {
        return car1.getMass() / car2.getMass();
    }

    private static projectSpeedARelativeToBOnNormal(): number {
        return ((1 - Collision.divideMasses(this.carB, this.carA)) / (Collision.divideMasses(this.carB, this.carA) + 1))
            * Collision.projectSpeedARelativeToBOnNormalReferentialO();
    }

    private static calculateSpeedBRelativeToB(): Vector3 {
        return Collision.calculateNormalVector().multiplyScalar((-Collision.divideMasses(this.carA, this.carB)) *
            (Collision.projectSpeedARelativeToBOnNormal() -
                Collision.projectSpeedARelativeToBOnNormalReferentialO()));
    }

    private static calculateSpeedARelativeToB(): Vector3 {
        return new Vector3().addVectors(Collision.calculateSpeedARelativeToBReferentialO(), Collision.calculateNormalVector()
            .multiplyScalar(Collision.projectSpeedARelativeToBOnNormal() -
                Collision.projectSpeedARelativeToBOnNormalReferentialO()));
    }

    private static calculateSpeedForB(): Vector3 {
        return this.carB.speed.addVectors(Collision.calculateSpeedBRelativeToB(), this.carB.speed);
    }

    private static calculateSpeedForA(): Vector3 {
        return this.carA.speed.addVectors(Collision.calculateSpeedARelativeToB(), this.carB.speed);
    }
}
