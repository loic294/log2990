import AbsCarCommand from "./AbsCarCommand";

export default class AccelerateDownCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.steerRight();
    }
}
