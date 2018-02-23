import { Vector3 } from "three";
import { Car } from "./car";

export default class Collision {
    private static carA: Car;
    private static carB: Car;
    public static detectCollision(carA: Car, carB: Car): boolean {
        return carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): void {
        this.carA = carA;
        this.carB = carB;

        const massBA: number = Collision.divideMasses(carB, carA);
        const normal: Vector3 = Collision.calculateNormalVector(carA, carB);

        const speedBO: Vector3 = carB.speed;
        const speedABO: Vector3 = Collision.calculateSpeedFromAToBThruO(carA, carB);

        const speedNormalABO: number = Collision.calculateProjectedSpeedFromAToBOnNormalThruO(carA, carB);
        const speedNormalAB: number = Collision.calculateProjectedSpeedFromAToBOnNormal(carA, carB);

        const speedBB: Vector3 = Collision.calculateSpeedFromBToB(carA, carB);

        const sAB: Vector3 = Collision.calculateSpeedFromAToB(carA, carB);

        Collision.calculateSpeedForB(carA, carB);
        Collision.calculateSpeedForA(carA, carB);
    }

    private static calculateNormalVector(carA: Car, carB: Car): Vector3 {
        return new Vector3().addVectors(Collision.getCenter(carA), Collision.getCenter(carB)).normalize();
    }

    private static getCenter(car: Car): Vector3 {
        return car.boundingBox.getCenter();
    }

    private static calculateSpeedFromAToBThruO(carA: Car, carB: Car): Vector3 {
        return new Vector3().addVectors(carA.speed, carB.speed.negate());
    }

    private static calculateProjectedSpeedFromAToBOnNormalThruO(carA: Car, carB: Car): number {
        return Collision.calculateSpeedFromAToBThruO(carA, carB).dot(Collision.calculateNormalVector(carA, carB));
    }

    private static divideMasses(car1: Car, car2: Car): number {
        return car1.getMass() / car2.getMass();
    }

    private static calculateProjectedSpeedFromAToBOnNormal(carA: Car, carB: Car): number {
        return ((1 - Collision.divideMasses(carB, carA)) / (Collision.divideMasses(carB, carA) + 1))
            * Collision.calculateProjectedSpeedFromAToBOnNormalThruO(carA, carB);
    }

    private static calculateSpeedFromBToB(carA: Car, carB: Car): Vector3 {
        return Collision.calculateNormalVector(carA, carB).multiplyScalar((-Collision.divideMasses(carA, carB)) *
            (Collision.calculateProjectedSpeedFromAToBOnNormal(carA, carB) -
                Collision.calculateProjectedSpeedFromAToBOnNormalThruO(carA, carB)));
    }

    private static calculateSpeedFromAToB(carA: Car, carB: Car): Vector3 {
        return new Vector3().addVectors(Collision.calculateSpeedFromAToBThruO(carA, carB), Collision.calculateNormalVector(carA, carB)
                .multiplyScalar(Collision.calculateProjectedSpeedFromAToBOnNormal(carA, carB) -
                Collision.calculateProjectedSpeedFromAToBOnNormalThruO(carA, carB)));
    }

    private static calculateSpeedForB(carA: Car, carB: Car): void {
        carB.speed.addVectors(Collision.calculateSpeedFromBToB(carA, carB), carB.speed);
    }

    private static calculateSpeedForA(carA: Car, carB: Car): void {
        carA.speed.addVectors(Collision.calculateSpeedFromAToB(carA, carB), carB.speed);
    }
}
