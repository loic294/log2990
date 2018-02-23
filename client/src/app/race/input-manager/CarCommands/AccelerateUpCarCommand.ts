import AbsCarCommand from "./AbsCarCommand";

export default class AccelerateUpCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.isAcceleratorPressed = false;
    }
}
