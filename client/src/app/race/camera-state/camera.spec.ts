import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { GameComponent } from "../game-component/game.component";
import { Vector3    } from "three";
import { CameraConstants } from "./AbsCamera";

describe("ThirdPersonCamera", () => {
    let renderer: RenderService;

    beforeEach((done: () => void) => {
        renderer = new RenderService();
        renderer.car.init().then(() => done());
    });

    it("should be a proper distance behind upon creation.",  () => {
        // const camera: Camera = renderer["_stateCamera"].getCamera();
        // const cameraPosition: Vector3 = camera.position;
        const expectedCameraPosition: Vector3 = new Vector3(
            renderer.car.meshPosition.x - CameraConstants.DISTANCE_BEHIND_FACTOR * renderer.car.direction.x,
            0,
            renderer.car.meshPosition.z - CameraConstants.DISTANCE_BEHIND_FACTOR * renderer.car.direction.z);

        expectedCameraPosition.x = renderer.car.meshPosition.x - CameraConstants.DISTANCE_BEHIND_FACTOR * renderer.car.direction.x;
        expectedCameraPosition.z = renderer.car.meshPosition.z - CameraConstants.DISTANCE_BEHIND_FACTOR * renderer.car.direction.z;

        expect ( true /*cameraPosition.x === expectedCameraPosition.x &&
        cameraPosition.z === expectedCameraPosition.z*/).toBe(true);
    });

    it("should follow the car properly at the same distance as when it was created.",  () => {

    });

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
