import AbsCarCommand from "./AbsCarCommand";

export default class BrakeDownCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.brake();
    }
}
