
export class PlaceCommand {

    public constructor(protected _distanceZ: number) {}

    public place(scene: THREE.Scene, event: Event): void {}

    public undo(scene: THREE.Scene): void {}
}
