import { Vector3, Raycaster, Intersection, Box3, BoxGeometry, Geometry } from "three";
import { Car } from "./car";

export default class Collision {
    private static carA: Car;
    private static carB: Car;

    public static detectCollision(carA: Car, carB: Car): boolean {
        return Collision.createBoundingBox(carA).intersectsBox(Collision.createBoundingBox(carB));
    }

    private static createBoundingBox(car: Car): Box3 {
        return new Box3().setFromObject(car);
    }

    private static createGeometry(car: Car): Geometry {
        const box: Box3 = new Box3().setFromObject(car);

        return new BoxGeometry(box.getSize().x, box.getSize().y, box.getSize().z)
            .translate(car.meshPosition.x, car.meshPosition.y, car.meshPosition.z);

    }

    public static detectCollision2(carA: Car, carB: Car): boolean {

        const originPoint: Vector3 = carA.meshPosition.clone();
        let result: boolean = false;

        for (let vertexIndex: number = 0; vertexIndex < Collision.createGeometry(carA).vertices.length; vertexIndex++) {
            const localVertex: Vector3 = Collision.createGeometry(carA).vertices[vertexIndex].clone();
            const globalVertex: Vector3 = localVertex.applyMatrix4(carA.matrix);
            const directionVector: Vector3 = globalVertex.sub(carA.meshPosition);

            const ray: Raycaster = new Raycaster(originPoint, directionVector.clone().normalize());
            const collisionResults: Intersection[] = ray.intersectObject(carB);

            result = (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length());
        }

        return result;

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
