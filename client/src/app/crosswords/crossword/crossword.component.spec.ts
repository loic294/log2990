// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { CrosswordComponent } from "./crossword.component";
import { CluesComponent } from "../clues/clues.component";
import { DifficultyComponent } from "../difficulty/difficulty.component";
import { GridComponent } from "../grid/grid.component";
import { WordService } from "../../word.service/word.service";
import { ModeComponent, ModeDialogComponent } from "../mode/mode.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material";
import { SocketService } from "../../socket.service/socket.service";
import { GridService } from "../../grid.service/grid.service";
import { DifficultyService } from "../../difficulty.service/difficulty.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TerminationComponent } from "../termination/termination.component";
import { GridLoadingService } from "../../grid-loading.service/grid-loaing.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
    imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
    declarations: [ModeDialogComponent, DifficultyComponent],
    entryComponents: [ModeDialogComponent],
    providers: [GridLoadingService]
  })
export class FakeTestDialogModule {}

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ClickOutsideModule,
                SocketIoModule.forRoot(config),
                BrowserAnimationsModule,
                FakeTestDialogModule
            ],
            declarations: [
                CrosswordComponent,
                CluesComponent,
                GridComponent,
                ModeComponent,
                TerminationComponent
            ],
            providers: [
                WordService,
                SocketService,
                GridService,
                DifficultyService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
