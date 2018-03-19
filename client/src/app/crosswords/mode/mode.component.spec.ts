// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClickOutsideModule } from "ng-click-outside";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { DifficultyComponent } from "../difficulty/difficulty.component";
import { ModeComponent, ModeDialogComponent } from "../mode/mode.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material";
import { SocketService } from "../../socket.service/socket.service";
import { DifficultyService } from "../../difficulty.service/difficulty.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
    imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
    declarations: [ModeDialogComponent, DifficultyComponent],
    entryComponents: [ModeDialogComponent]
  })
export class FakeTestDialogModule {}

describe("ModeComponent", () => {
    let component: ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;
    let dialog: ModeDialogComponent;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
            imports: [
                ClickOutsideModule,
                SocketIoModule.forRoot(config),
                BrowserAnimationsModule,
                FakeTestDialogModule,
            ],
            declarations: [
                ModeComponent,
            ],
            providers: [
                SocketService,
                DifficultyService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dialog = component.dialog.open(ModeDialogComponent).componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have an open dialog", () => {
        expect(ModeDialogComponent).toBeTruthy();
    });

    it("should show two modes of play, single and two players", () => {

        const modes: string [] = dialog.modes;
        const expected: string[] = ["Single Player", "Two Players"];

        expect(modes).toEqual(expected);

    });

    it("should not show difficulty options if mode option is not selected", () => {

        expect(dialog.showDifficulty).toBeFalsy();

    });

    it("should not show name input if mode option is not selected", () => {

        expect(dialog.showNameInput).toBeFalsy();

    });

    it("should not show Start Game if mode option is not selected", () => {

        expect(dialog.showStartSoloGame).toBeFalsy();

    });

    it("should not show games if mode option is not selected", () => {

        expect(dialog.showGames).toBeFalsy();

    });

    it("should show difficulties upon Single Player selection", () => {

        dialog.onSelect("Single Player");
        expect(dialog.showDifficulty).toBeTruthy();

    });

    it("should show show difficulties upon Two Player selection", () => {

        dialog.onSelect("Two Players");
        expect(dialog.showDifficulty).toBeTruthy();

    });

    it("should wait for player upon Two players game creation", () => {

        const mode: string = "Two Players";

        dialog.createGame(mode);
        expect(dialog.waitingForPlayer).toBeTruthy();

    });

    it("should display available games upon Two players game join", () => {

        dialog.toggleShowGames();
        expect(dialog.showGames).toBeTruthy();

    });
});