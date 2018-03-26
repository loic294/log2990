import { TestBed, inject } from "@angular/core/testing";

import { AiService } from "./ai.service";

describe("AiService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AiService]
        });
    });

    it("should be created", inject([AiService], (service: AiService) => {
        expect(service).toBeTruthy();
    }));
});
