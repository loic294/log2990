import { HostListener } from "@angular/core";

export default class InputManager {
    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
    }
}
