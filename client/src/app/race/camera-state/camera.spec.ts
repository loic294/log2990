import { TestBed } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";

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
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be a proper distance behind upon creation.");

    it("should follow the car properly at the same distance as when it was created.");

});
