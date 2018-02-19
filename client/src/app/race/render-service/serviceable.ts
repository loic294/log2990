
import { Injectable } from "@angular/core";
@Injectable()
export default abstract class Serviceable {

    public abstract execute(): void;
}