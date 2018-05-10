import { Vector3, Matrix4, Mesh, Raycaster, Intersection, Object3D } from "three";
import { Car } from "./car";

const ABSOLUTE_CAR_LENGTH_X: number = -0.7128778274977209;
const ABSOLUTE_CAR_LENGTH_Y: number = -0.007726105637907718;
const ABSOLUTE_CAR_LENGTH_Z: number = -1.8093634648776054;

export default class Collision {
    private static corners: Vector3[];

    public static detectCollision(firstCar: Car, secondCar: Car): boolean {
        return firstCar.boundingBox.intersectsBox(secondCar.boundingBox);
    }

    public static detectOutOfBounds(car: Car, track: Mesh[]): Vector3 {
        Collision.initializeCorners();
        let intersectionResults: Intersection[] = [];
        let outOfBounds: boolean = false;

        for (const corner of Collision.corners) {
            const globalVertex: Vector3 = corner.applyMatrix4(car.mesh.matrix);
            const directionVector: Vector3 = globalVertex.sub(car.boundingBox.getCenter());
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), directionVector.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);
            if (collisionResults.length <= 0) {
                outOfBounds = true;
            } else {
                intersectionResults = [...intersectionResults, ...collisionResults];
            }
        }
        if (outOfBounds) {
            return Collision.collideOutOfBounds(car, intersectionResults);
        } else {
            return null;
        }
    }

    private static collideOutOfBounds(car: Car, intersections: Intersection[]): Vector3 {
        for (const intersection of intersections) {
            if (intersection !== null) {
                const perpendicular: Vector3 = (Collision.isToTheRightOfLine(car, intersection.object) ?
                                        Collision.trackPerpendicular(intersection.object, 1) :
                                        Collision.trackPerpendicular(intersection.object, -1));
                const angle: number = car.direction.angleTo(perpendicular);
                const incidenceVector: Vector3 = perpendicular;
                incidenceVector.applyAxisAngle(incidenceVector.normalize(), -angle);
                incidenceVector.multiplyScalar(car.speed.length());

                return incidenceVector;
            }
        }

        return new Vector3();
    }

    private static isToTheRightOfLine(car: Car, track: Object3D): boolean {
        return Collision.trackDirection(track).normalize().cross(car.direction.normalize()).y < 0;
    }

    private static trackPerpendicular(track: Object3D, positive: number): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const trackDirection: Vector3 = new Vector3(positive * -1, 0, 0);

        rotationMatrix.extractRotation(track.matrix);
        trackDirection.applyMatrix4(rotationMatrix);

        return trackDirection;
    }

    private static trackDirection(track: Object3D): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const trackDirection: Vector3 = new Vector3(0, 1, 0);

        rotationMatrix.extractRotation(track.matrix);
        trackDirection.applyMatrix4(rotationMatrix);

        return trackDirection;
    }

    private static initializeCorners(): void {
        Collision.corners = [];
        Collision.corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
        Collision.corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
    }

    public static collide(carA: Car, carB: Car): Array<Vector3> {
        const resultSpeeds: Array<Vector3> = [];

        resultSpeeds.push(Collision.calculateSpeed(carB, carA.mass + carB.mass));
        resultSpeeds.push(Collision.calculateSpeed(carA, carA.mass + carB.mass));

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
