import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { DifficultyComponent } from "./difficulty.component";
// import { By } from "@angular/platform-browser";

enum Difficulty {
    Easy = 0,
    Normal = 1,
    Hard = 2
}

describe("DifficultyComponent", () => {
    let component: DifficultyComponent;
    let fixture: ComponentFixture<DifficultyComponent>;
    let debugElement: DebugElement;
    // let htmlElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement; // .query(By.css("h2"));
        // htmlElement = debugElement.nativeElement;

        fixture.detectChanges();
    });

    it("Should create DifficultyComponent", () => {
        expect(component).toBeTruthy();
    });

    it("Should display Easy", () => {
        component.onSelect(component.difficulties[Difficulty.Easy]);
        expect(component.selectedDifficulty).toBe("Easy");
    });

    it("Should display Normal", () => {

        component.onSelect(component.difficulties[Difficulty.Normal]);
        expect(component.selectedDifficulty).toBe("Normal");
    });

    it("Should display Hard", () => {

        component.onSelect(component.difficulties[Difficulty.Hard]);
        expect(component.selectedDifficulty).toBe("Hard");
    });

});
