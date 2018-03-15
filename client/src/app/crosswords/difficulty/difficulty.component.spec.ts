// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { DifficultyComponent } from "./difficulty.component";
import { Difficulty } from "../../../../../common/grid/difficulties";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "../grid.service/grid.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("DifficultyComponent", () => {
    let component: DifficultyComponent;
    let fixture: ComponentFixture<DifficultyComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SocketIoModule.forRoot(config)],
            declarations: [DifficultyComponent],
            providers: [DifficultyService, SocketService, GridService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Should create DifficultyComponent", () => {
        expect(component).toBeTruthy();
    });

    it("Should display Easy", () => {
        component.onSelect(Difficulty.Easy);
        expect(component.selectedDifficulty).toBe(Difficulty.Easy);
    });

    it("Should display Normal", () => {
        component.onSelect(Difficulty.Normal);
        expect(component.selectedDifficulty).toBe(Difficulty.Normal);
    });

    it("Should display Hard", () => {
        component.onSelect(Difficulty.Hard);
        expect(component.selectedDifficulty).toBe(Difficulty.Hard);
    });

});
