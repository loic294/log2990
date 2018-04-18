import { Vector3, Matrix4, Mesh, Raycaster, Intersection, ArrowHelper, Object3D } from "three";
import { Car } from "./car";

const ABSOLUTE_CAR_LENGTH_X: number = -0.7128778274977209;
const ABSOLUTE_CAR_LENGTH_Y: number = -0.007726105637907718;
const ABSOLUTE_CAR_LENGTH_Z: number = -1.8093634648776054;
const COLOUR: number = 0xFFFF00;
const OTHER_COLOUR: number = 0xFF0000;
const LENGTH: number = 10;

export default class Collision {
    private static corners: Vector3[];

    public static detectCollision(firstCar: Car, secondCar: Car): boolean {
        return firstCar.boundingBox.intersectsBox(secondCar.boundingBox);
    }

    public static visualizeOutOfBoundsBadly(car: Car, track: Mesh[]): ArrowHelper[] {
        Collision.initializeCorners();
        const arrows: ArrowHelper[] = [];

        for (const corner of Collision.corners) {
            const globalVertex: Vector3 = corner.applyMatrix4(car.mesh.matrix);
            const directionVector: Vector3 = globalVertex.sub(car.boundingBox.getCenter());
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), directionVector.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);
            if (collisionResults.length <= 0) {
                arrows.push(new ArrowHelper(directionVector.normalize(), car.boundingBox.getCenter(), LENGTH, OTHER_COLOUR));
            } else {
                arrows.push(new ArrowHelper(directionVector.normalize(), car.boundingBox.getCenter(), LENGTH, COLOUR));
            }
        }

        return arrows;
    }

    public static detectOutOfBounds(car: Car, track: Mesh[]): Vector3 {
        Collision.initializeCorners();
        const intersectionResults: Intersection[] = [];
        let outOfBounds: boolean = false;

        for (const corner of Collision.corners) {
            const globalVertex: Vector3 = corner.applyMatrix4(car.mesh.matrix);
            const directionVector: Vector3 = globalVertex.sub(car.boundingBox.getCenter());
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), directionVector.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);
            if (collisionResults.length <= 0) {
                outOfBounds = true;
            } else {
                intersectionResults.concat(collisionResults);
            }
        }
        if (outOfBounds) {
            return new Vector3();
        } else {
            return null;
        }
    }

    public static collideOutOfBounds(car: Car, intersections: Intersection[]): Vector3 {
        const angle: number = car.direction.angleTo(Collision.trackPerpendicular(intersections[0].object));
        const incidenceVector: Vector3 = Collision.trackPerpendicular(intersections[0].object);
        incidenceVector.applyAxisAngle(incidenceVector, angle);
        incidenceVector.multiplyScalar(car.speed.length());

        return incidenceVector;
    }
    // perpendiuclar vector to both the direction vectors, find the angle

    public static trackDirection(track: Object3D): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const trackDirection: Vector3 = new Vector3(0, 1, 0); // Initial direction for the track

        rotationMatrix.extractRotation(track.matrix);
        trackDirection.applyMatrix4(rotationMatrix);

        return trackDirection;
    }

    public static trackPerpendicular(track: Object3D): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const trackDirection: Vector3 = new Vector3(0, 0, 1); // Initial perpendicular for the track

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

        resultSpeeds.push(Collision.calculateSpeed(carA, carA.mass + carB.mass));
        resultSpeeds.push(Collision.calculateSpeed(carB, carA.mass + carB.mass));

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
