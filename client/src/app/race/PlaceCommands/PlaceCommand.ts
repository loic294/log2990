
export class PlaceCommand {

    public constructor(protected _distanceZ: number) {}

    public place(scene: THREE.Scene, renderer: THREE.WebGLRenderer, event: Event): void {}

    public dragDot(event: DragEvent, renderer: THREE.WebGLRenderer): void {}

    public undo(scene: THREE.Scene): void {}
}
