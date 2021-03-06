import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from "../camera-service/camera.service";
import { AudioService } from "../audio-service/audio.service";
import { EnvironmentService } from "../environment-service/environment.service";
import { TrackProgressionService } from "../trackProgressionService";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, AudioService, EnvironmentService, TrackProgressionService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
