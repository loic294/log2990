// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DifficultyComponent } from "./difficulty.component";
import { ButtonComponent } from "../button/button.component";
import { Difficulty } from "../../../../../common/grid/difficulties";

describe("DifficultyComponent", () => {
    let component: DifficultyComponent;
    let fixture: ComponentFixture<DifficultyComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyComponent, ButtonComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Should create DifficultyComponent", () => {
        expect(component).toBeTruthy();
        expect(component.selectedDifficulty).toBe(Difficulty.Easy);
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
