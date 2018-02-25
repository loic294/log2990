import AbsCarCommand from "./AbsCarCommand";

export default class ReleaseUpCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.releaseSteering();
    }
}
