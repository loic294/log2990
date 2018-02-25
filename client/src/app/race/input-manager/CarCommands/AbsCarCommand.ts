import { Car } from "../../car/car";
import AbsCommand from "../AbsCommand";

export default abstract class AbsCarCommand extends AbsCommand {
    public constructor(protected car: Car) {
        super();
    }
}
