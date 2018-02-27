import { TestBed, inject } from "@angular/core/testing";

import { DifficultyService } from "./difficulty.service";

describe("SettingsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DifficultyService]
    });
  });

  it("should be created", inject([DifficultyService], (service: DifficultyService) => {
    expect(service).toBeTruthy();
  }));
});
