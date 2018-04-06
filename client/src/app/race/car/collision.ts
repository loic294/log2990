import { Vector3, Raycaster, Intersection } from "three";
import { Car } from "./car";

export default class Collision {
    private static carA: Car;
    private static carB: Car;
    public static detectCollision(carA: Car, carB: Car): boolean {
        return carA.boundingBox.intersectsBox(carB.boundingBox);
    }

    public static detectCollisionAndCollide(carA: Car, carB: Car): void {

        const ray: Raycaster = new Raycaster(carA.meshPosition.clone(), carB.meshPosition.clone().normalize());
        const collisionResults: Intersection[] = ray.intersectObject(carB);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            Collision.collide(carA, carB);
            console.log("TESTING");
        }

    }

    public static collide(carA: Car, carB: Car): void {
        this.carA = carA;
        this.carB = carB;

        Collision.calculateSpeedForB();
        Collision.calculateSpeedForA();
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

    private static calculateSpeedForB(): void {
        this.carB.speed.addVectors(Collision.calculateSpeedBRelativeToB(), this.carB.speed);
    }

    private static calculateSpeedForA(): void {
        this.carA.speed.addVectors(Collision.calculateSpeedARelativeToB(), this.carB.speed);
    }
}
