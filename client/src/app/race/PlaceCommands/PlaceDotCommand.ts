
import { PlaceCommand } from "./PlaceCommand";

import { Vector3, PointsMaterial, Points, Geometry, LineBasicMaterial, Line, Object3D, /*Raycaster, Intersection*/ } from "three";

const TWO: number = 2; // a changer
const magicNumberX: number = 1288.194; // a changer
const magicNumberY: number = 1292.105; // a changer

export class PlaceDotCommand extends PlaceCommand {

    private _dotMemory: Array<Vector3> = new Array();
    private _isCycle: boolean = false;

    public place(scene: THREE.Scene, renderer: THREE.WebGLRenderer, event: MouseEvent): void {
        // Methode temporaire (activer le click seulement sur objet)
        if (event.srcElement === renderer.domElement) {
            if (!this._isCycle) {
                const dotGeo: THREE.Geometry = new Geometry();
                this.findCoordinates(event.offsetX, event.offsetY, renderer);
                dotGeo.vertices.push(new Vector3(this._dotMemory[this._dotMemory.length - 1].x,
                    this._dotMemory[this._dotMemory.length - 1].y,
                    this._dotMemory[this._dotMemory.length - 1].z));
                const dotMat: THREE.PointsMaterial = (this._dotMemory.length === 1) ? new PointsMaterial({ color: 0xFFFFFF, size: 1 }) :
                    new PointsMaterial({ color: 0x0000FF, size: 1 });
                const dot: THREE.Points = new Points(dotGeo, dotMat);
                dot.name = "dot" + this._dotMemory.length;
                scene.add(dot);

                this.updateLines(scene);

                this.findIfCycle();
            }
        }
    }

    private findCoordinates(offsetX: number, offsetY: number, renderer: THREE.WebGLRenderer): void {
        const canvas: HTMLCanvasElement = renderer.domElement;

        const tempX: number = offsetX - (canvas.clientWidth / TWO);
        const tempY: number = offsetY - (canvas.clientHeight / TWO);
        const vec: Vector3 = new Vector3((canvas.clientWidth / canvas.clientHeight) * tempX * this._distanceZ / canvas.clientWidth,
             0, tempY * this._distanceZ / canvas.clientHeight);
        this._dotMemory.push(vec);
        console.log("Offset: " + offsetX + ";" + offsetY);
        console.log("Modified: " + vec.x + " ; " + vec.y + " ; " + vec.z);
    }

    private updateLines(scene: THREE.Scene): void {
        if (this._dotMemory.length > 1) {
            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 10 });
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - 1]);
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - TWO]);
            const line: THREE.Line = new Line(lineGeo, lineMat);
            line.name = "line" + (this._dotMemory.length - 1);
            scene.add(line);
        }

    }

    /*
    * Ineficace mais marche si on clique directement dessus au millimetre pres. A changer.
    */
    private findIfCycle(): void {
        for (let i: number = 0; i < this._dotMemory.length - 1; ++i) {
            if (this._dotMemory[i].x === this._dotMemory[this._dotMemory.length - 1].x &&
                this._dotMemory[i].z === this._dotMemory[this._dotMemory.length - 1].z) {
                this._isCycle = true;
            }
        }
    }

    public undo(scene: THREE.Scene): void {
        const dotName: string = "dot" + this._dotMemory.length;
        const lineName: string = "line" + (this._dotMemory.length - 1);

        const dot: Object3D = scene.getObjectByName(dotName);
        scene.remove(dot);

        const line: Object3D = scene.getObjectByName(lineName);
        scene.remove(line);

        this._dotMemory.pop();
    }
}
