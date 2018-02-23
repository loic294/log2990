import { Vector3 } from "three";
import { Car } from "./car";

export default class Collision {
    public static detectCollision(carA: Car, carB: Car): boolean {
        return  carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): void {
        const massBA: number = carB.getMass() / carA.getMass();
        const normal: Vector3 = Collision.calculateNormalVector(carA, carB);

        const speedAO: Vector3 = carA.speed;
        const speedBO: Vector3 = carB.speed;
        const speedABO: Vector3 = Collision.calculateSpeedFromAToBThruO(carA, carB);

        const speedNormalABO: number = speedABO.dot(normal);
        const speedNormalAB: number = ((1 - massBA) / (massBA + 1)) * speedNormalABO;

        const speedBB: Vector3 = normal.multiplyScalar((-carA.getMass() / carB.getMass()) * (speedNormalAB - speedNormalABO));

        const sAB: Vector3 = new Vector3();
        sAB.addVectors(speedABO, normal.multiplyScalar(speedNormalAB - speedNormalABO));

        carB.speed.addVectors(speedBB, speedBO);
        carA.speed.addVectors(sAB, speedBO);
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
}
