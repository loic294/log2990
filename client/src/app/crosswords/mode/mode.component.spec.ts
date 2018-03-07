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

describe("ModeDialogComponent", () => {
    let component: ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;

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
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

});
