import AbsCarCommand from "./AbsCarCommand";

export default class BrakeUpCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.releaseBrakes();
    }
}
