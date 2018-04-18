import { Vector3, Matrix4, Mesh, Raycaster, Intersection, ArrowHelper } from "three";
import { Car } from "./car";

const SPECIAL_COLOR: number = 0xFFFF00;
const SPECIAL_COLOR_2: number = 0x888F00;
const ABSOLUTE_CAR_LENGTH_X: number = -0.7128778274977209;
const ABSOLUTE_CAR_LENGTH_Y: number = -0.007726105637907718;
const ABSOLUTE_CAR_LENGTH_Z: number = -1.8093634648776054;
const LENGTH: number = 20;

export default class Collision {

    public static detectCollision(firstCar: Car, secondCar: Car): boolean {
        return firstCar.boundingBox.intersectsBox(secondCar.boundingBox);
    }

    public static detectOutOfBounds(car: Car, track: Mesh[]): ArrowHelper[] {
        const corners: Vector3[] = [];
        const results: ArrowHelper[] = [];
        corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, ABSOLUTE_CAR_LENGTH_Z));
        corners.push(new Vector3(-ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
        corners.push(new Vector3(ABSOLUTE_CAR_LENGTH_X, ABSOLUTE_CAR_LENGTH_Y, -ABSOLUTE_CAR_LENGTH_Z));
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(car.mesh.matrix);

        for (const corner of corners) {
            const globalVertex: Vector3 = corner.applyMatrix4(car.mesh.matrix);
            const directionVector: Vector3 = globalVertex.sub(car.boundingBox.getCenter());
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), directionVector.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);

            results.push(new ArrowHelper(directionVector.normalize(), car.boundingBox.getCenter(), LENGTH, SPECIAL_COLOR));

            if (collisionResults.length <= 0) {
                results.push(new ArrowHelper(directionVector.multiplyScalar(-1).normalize(), car.boundingBox.getCenter(), LENGTH, SPECIAL_COLOR_2))
            }
        }

        return results;
    }
    /*
        MIN BOX: -1.8093634648776054, -0.007726105637907718, -0.7128778274977209
        MAX BOX: 1.5854470477789642, 0.9663772207415103, 0.7128778274977209
        CENTER BOX: -0.11195820854932059, 0.4793255575518013, 0
        var originPoint = MovingCube.position.clone();

        corners.push(new Vector3(car.boundingBox.min.x, car.boundingBox.min.y, car.boundingBox.min.z));

        clearText();

        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
            var directionVector = globalVertex.sub( MovingCube.position );

            var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( collidableMeshList );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
                appendText(" Hit ");
        }

    */

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
