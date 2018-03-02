import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { GameComponent } from "../game-component/game.component";

describe("ThirdPersonCamera", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be a proper distance behind upon creation.");

    it("should follow the car properly at the same distance as when it was created.");

});
describe("TopDownCamera", () => {
    let comp: GameComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameComponent], // declare the test component
            providers: [RenderService]
        })
            .compileComponents();  // compile template and css
    }));

    beforeEach(() => {
        const fixture: ComponentFixture<GameComponent> = TestBed.createComponent(GameComponent);
        comp = fixture.componentInstance;

        comp.ngAfterViewInit();
    });

    it("should be a proper distance behind upon creation.");

    it("should follow the car properly at the same distance as when it was created.");

});
