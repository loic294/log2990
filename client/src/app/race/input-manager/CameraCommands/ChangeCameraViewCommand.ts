import AbsCameraCommand from "./AbsCameraCommand";

enum CAMERA_VIEW {
    TOP_DOWN = 0,
    THIRD_PERSON = 1
}

export default class ChangeCameraViewCommand extends AbsCameraCommand {
    public subscribe(): void {
        this.renderer.changeCamera();
    }
}
