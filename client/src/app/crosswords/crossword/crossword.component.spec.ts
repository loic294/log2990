import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";

import { ButtonComponent } from "../button/button.component";
import { CrosswordComponent } from "./crossword.component";
import { CluesComponent } from "../clues/clues.component";
import { DifficultyComponent } from "../difficulty/difficulty.component";
import { GridComponent } from "../grid/grid.component";
import { ShadowBoxComponent } from "../shadow-box/shadow-box.component";
import { ContainerComponent } from "../container/container.component";
import { WordService } from "../../word.service/word.service";

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ClickOutsideModule],
                declarations: [
                    CrosswordComponent,
                    CluesComponent,
                    DifficultyComponent,
                    GridComponent,
                    ShadowBoxComponent,
                    ContainerComponent,
                    ButtonComponent,
                ],
                providers: [WordService],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
