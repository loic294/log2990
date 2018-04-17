import { Vector3, Matrix4, Mesh, Raycaster, Intersection } from "three";
import { Car } from "./car";

const ADJUST_POSITION: number = 0.1;

export default class Collision {

    public static detectCollision(firstCar: Car, secondCar: Car): boolean {
        return firstCar.boundingBox.intersectsBox(secondCar.boundingBox);
    }

    public static detectOutOfBounds(car: Car, track: Mesh[]): boolean {
        const corners: Vector3[] = [];
        corners.push( new Vector3(car.boundingBox.min.x, car.boundingBox.min.y - ADJUST_POSITION, car.boundingBox.min.z));
        corners.push( new Vector3(car.boundingBox.min.x, car.boundingBox.min.y - ADJUST_POSITION, car.boundingBox.max.z));
        corners.push( new Vector3(car.boundingBox.max.x, car.boundingBox.min.y - ADJUST_POSITION, car.boundingBox.min.z));
        corners.push( new Vector3(car.boundingBox.max.x, car.boundingBox.min.y - ADJUST_POSITION, car.boundingBox.max.z));

        for (const corner of corners) {
            const ray: Raycaster = new Raycaster(car.boundingBox.getCenter(), corner.normalize());
            const collisionResults: Intersection[] = ray.intersectObjects(track);
            if (collisionResults.length <= 0) {

                return true;
            }
        }

        return false;
    }
/*
	var originPoint = MovingCube.position.clone();

	clearText();

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
