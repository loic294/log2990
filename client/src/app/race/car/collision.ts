import { Vector3, Matrix4, Object3D, ObjectLoader, Euler, Quaternion } from "three";
import { Car } from "./car";

export default class Collision {
    public static checkCollision(carA: Car, carB: Car): boolean {
        return  carA.boundingBox.isIntersectionBox(carB.boundingBox);
    }

    public static collide(carA: Car, carB: Car): void {
        const ra: Vector3 = carA.boundingBox.getCenter();
        const rb: Vector3 = carB.boundingBox.getCenter();
        const mBA: number = carB.mass / carA.mass;

        const n: Vector3 = new Vector3();
        n.addVectors(rb, (ra).negate()).normalize();

        const sAO: Vector3 = carA.speed;
        const sBO: Vector3 = carB.speed;
        const sABO: Vector3 = new Vector3();
        sABO.addVectors(sAO, sBO.negate());

        const snABO: number = sABO.dot(n);
        const snAB: number = ((1 - mBA) / (mBA + 1)) * snABO;

        const sBB: Vector3 = n.multiplyScalar((-carA.mass / carB.mass) * (snAB - snABO));

        const sAB: Vector3 = new Vector3();
        sAB.addVectors(sABO, n.multiplyScalar(snAB - snABO));

        carB.speed.addVectors(sBB, sBO);
        carA.speed.addVectors(sAB, sBO);
    }
}
