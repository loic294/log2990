
import { PlaceCommand } from "./PlaceCommand";

import { Vector3, PointsMaterial, Points, Geometry, LineBasicMaterial, Line, Object3D } from "three";

const TWO: number = 2;
const POINT_SIZE: number = 2;

export class PlaceDotCommand extends PlaceCommand {

    private _dotMemory: Array<Vector3> = new Array();
    private _isCycle: boolean = false;

    public place(scene: THREE.Scene, renderer: THREE.WebGLRenderer, event: MouseEvent): void {
        // Methode temporaire (activer le click seulement sur objet)

       // if (event.srcElement === renderer.domElement) {

            if (!this._isCycle) {
                const dotGeo: THREE.Geometry = new Geometry();
                this.findCoordinates(event.offsetX, event.offsetY, renderer);
                dotGeo.vertices.push(new Vector3(this._dotMemory[this._dotMemory.length - 1].x,
                                                 this._dotMemory[this._dotMemory.length - 1].y,
                                                 this._dotMemory[this._dotMemory.length - 1].z));
                const dotMat: THREE.PointsMaterial = (this._dotMemory.length === 1) ?
                                                    new PointsMaterial({ color: 0xFFFFFF, size: POINT_SIZE }) :
                                                    new PointsMaterial({ color: 0x0000FF, size: POINT_SIZE });
                const dot: THREE.Points = new Points(dotGeo, dotMat);
                dot.name = "dot" + this._dotMemory.length;
                scene.add(dot);

                this.updateLines(scene);
                this.findIfCycle(scene);
            }
       // }
    }

    private findCoordinates(offsetX: number, offsetY: number, renderer: THREE.WebGLRenderer): void {
        const canvas: HTMLCanvasElement = renderer.domElement;

        const tempX: number = offsetX - (canvas.clientWidth / TWO);
        const tempY: number = offsetY - (canvas.clientHeight / TWO);
        const vec: Vector3 = new Vector3((canvas.clientWidth / canvas.clientHeight) * tempX * this._distanceZ / canvas.clientWidth,
                                         0, tempY * this._distanceZ / canvas.clientHeight);
        this._dotMemory.push(vec);
    }

    private updateLines(scene: THREE.Scene): void {
        if (this._dotMemory.length > 1) {
            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 8 });
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - 1]);
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - TWO]);
            const line: THREE.Line = new Line(lineGeo, lineMat);
            line.name = "line" + (this._dotMemory.length - 1);
            scene.add(line);
        }
    }

    private connectToFirst(scene: THREE.Scene): void {
        this.undo(scene);
        const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 8 });
        const lineGeo: THREE.Geometry = new Geometry();
        lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - 1]);
        lineGeo.vertices.push(this._dotMemory[0]);
        const line: THREE.Line = new Line(lineGeo, lineMat);
        line.name = "line" + (this._dotMemory.length - 1);
        scene.add(line);
    }

    private findIfCycle(scene: THREE.Scene): void {
        if (this._dotMemory.length !== 1 && this.pointsRadiusCollide()) {
             this.connectToFirst(scene);
             this._isCycle = true;
        }
    }

    private pointsRadiusCollide(): boolean {
        return Math.sqrt(Math.pow(this._dotMemory[0].x - this._dotMemory[this._dotMemory.length - 1].x, TWO) +
               Math.pow(this._dotMemory[0].z - this._dotMemory[this._dotMemory.length - 1].z, TWO)) < POINT_SIZE / TWO;
    }

    public undo(scene: THREE.Scene): void {
        if (!this._isCycle) {
            const dotName: string = "dot" + this._dotMemory.length;
            const lineName: string = "line" + (this._dotMemory.length - 1);

            const dot: Object3D = scene.getObjectByName(dotName);
            scene.remove(dot);

            const line: Object3D = scene.getObjectByName(lineName);
            scene.remove(line);

            this._dotMemory.pop();
        }
    }

    public dragDot(event: DragEvent, renderer: THREE.WebGLRenderer): void {

    }
}
