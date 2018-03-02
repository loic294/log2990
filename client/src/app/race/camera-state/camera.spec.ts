import { TestBed } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import TopDownCamera from "./top-down-camera";

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
    let topDownCamera: TopDownCamera;

    beforeEach(() => {
        topDownCamera = new TopDownCamera(new RenderService());
    });
    it("should be a proper distance behind upon creation.");

    it("should follow the car properly at the same distance as when it was created.");

});
