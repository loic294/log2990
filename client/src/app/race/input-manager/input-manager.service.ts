import { Car } from "../car/car";
import { Injectable } from "@angular/core";
import AbsCommand from "./AbsCommand";
import AccelerateDownCarCommand from "./CarCommands/AccelerateDownCarCommand";
import AccelerateUpCarCommand from "./CarCommands/AccelerateUpCarCommand";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

interface CommandKeyDict {
    command: AbsCommand;
    keyCode: number;
}

@Injectable()
export default class InputManagerService {

    private keyDownCommands: CommandKeyDict[];
    private keyUpCommands: CommandKeyDict[];

    public init(car: Car): void {
        this.keyDownCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateDownCarCommand(car)}
        ];

        this.keyUpCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateUpCarCommand(car)}
        ];
    }

    public handleKeyDown(event: KeyboardEvent): void {
        const command: CommandKeyDict = this.keyDownCommands.find( (cmd: CommandKeyDict) => {
            return command.keyCode === event.keyCode;
        });
        if (command) {
            command.command.subscribe();
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {

    }
}
