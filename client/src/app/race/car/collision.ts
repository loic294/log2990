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
        const normal: Vector3 = Collision.calculateNormalVector();

        const speedBO: Vector3 = carB.speed;
        const speedABO: Vector3 = Collision.calculateSpeedFromAToBThruO();

        const speedNormalABO: number = Collision.calculateProjectedSpeedFromAToBOnNormalThruO();
        const speedNormalAB: number = Collision.calculateProjectedSpeedFromAToBOnNormal();

        const speedBB: Vector3 = Collision.calculateSpeedFromBToB();

        const sAB: Vector3 = Collision.calculateSpeedFromAToB();

        Collision.calculateSpeedForB();
        Collision.calculateSpeedForA();
    }

    private static calculateNormalVector(): Vector3 {
        return new Vector3().addVectors(Collision.getCenter(this.carA), Collision.getCenter(this.carB)).normalize();
    }

    private static getCenter(car: Car): Vector3 {
        return car.boundingBox.getCenter();
    }

    private static calculateSpeedFromAToBThruO(): Vector3 {
        return new Vector3().addVectors(this.carA.speed, this.carB.speed.negate());
    }

    private static calculateProjectedSpeedFromAToBOnNormalThruO(): number {
        return Collision.calculateSpeedFromAToBThruO().dot(Collision.calculateNormalVector());
    }

    private static divideMasses(car1: Car, car2: Car): number {
        return car1.getMass() / car2.getMass();
    }

    private static calculateProjectedSpeedFromAToBOnNormal(): number {
        return ((1 - Collision.divideMasses(this.carB, this.carA)) / (Collision.divideMasses(this.carB, this.carA) + 1))
            * Collision.calculateProjectedSpeedFromAToBOnNormalThruO();
    }

    private static calculateSpeedFromBToB(): Vector3 {
        return Collision.calculateNormalVector().multiplyScalar((-Collision.divideMasses(this.carA, this.carB)) *
            (Collision.calculateProjectedSpeedFromAToBOnNormal() -
                Collision.calculateProjectedSpeedFromAToBOnNormalThruO()));
    }

    private static calculateSpeedFromAToB(): Vector3 {
        return new Vector3().addVectors(Collision.calculateSpeedFromAToBThruO(), Collision.calculateNormalVector()
                .multiplyScalar(Collision.calculateProjectedSpeedFromAToBOnNormal() -
                Collision.calculateProjectedSpeedFromAToBOnNormalThruO()));
    }

    private static calculateSpeedForB(): void {
        this.carB.speed.addVectors(Collision.calculateSpeedFromBToB(), this.carB.speed);
    }

    private static calculateSpeedForA(): void {
        this.carA.speed.addVectors(Collision.calculateSpeedFromAToB(), this.carB.speed);
    }
}
