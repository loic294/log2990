import { async, ComponentFixture, TestBed } from "@angular/core/testing";
<<<<<<< 10b8482b07a4e3f861d998db93acc32e0788f148
import { DifficultyComponent } from "./difficulty.component";
=======
import { DebugElement } from "@angular/core";
import { DifficultyComponent } from "./difficulty.component";
// import { By } from "@angular/platform-browser";
>>>>>>> Ajout des boutons et correction du code en fonction des normes

enum Difficulty {
    Easy = 0,
    Normal = 1,
    Hard = 2
}

describe("DifficultyComponent", () => {
    let component: DifficultyComponent;
    let fixture: ComponentFixture<DifficultyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Should create DifficultyComponent", () => {
        expect(component).toBeTruthy();
        expect(component.selectedDifficulty).toBe("Easy");
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
