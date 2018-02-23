import { Vector3 } from "three";
import { Car } from "./car";

export default class Collision {
    public static detectCollision(carA: Car, carB: Car): boolean {
        return  carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): void {
        const radiusA: Vector3 = carA.boundingBox.getCenter();
        const radiusB: Vector3 = carB.boundingBox.getCenter();
        const massBA: number = carB.getMass() / carA.getMass();

        const normal: Vector3 = new Vector3();
        normal.addVectors(radiusB, (radiusA).negate()).normalize();

        const speedAO: Vector3 = carA.speed;
        const speedBO: Vector3 = carB.speed;
        const speedABO: Vector3 = new Vector3();
        speedABO.addVectors(speedAO, speedBO.negate());

        const speedNormalABO: number = speedABO.dot(normal);
        const speedNormalAB: number = ((1 - massBA) / (massBA + 1)) * speedNormalABO;

        const speedBB: Vector3 = normal.multiplyScalar((-carA.getMass() / carB.getMass()) * (speedNormalAB - speedNormalABO));

        const sAB: Vector3 = new Vector3();
        sAB.addVectors(speedABO, normal.multiplyScalar(speedNormalAB - speedNormalABO));

        carB.speed.addVectors(speedBB, speedBO);
        carA.speed.addVectors(sAB, speedBO);
    }
}
