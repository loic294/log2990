import { TestBed, inject } from "@angular/core/testing";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { SocketService } from "../crosswords/socket.service/socket.service";
import { DifficultyService } from "../crosswords/difficulty.service/difficulty.service";
import { GridLoadingService } from "./grid-loading.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("GridLoadingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
      ],
      providers: [
        SocketService,
        DifficultyService,
        GridLoadingService
      ]
    });
  });

  it("should be created", inject([SocketService, GridLoadingService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});
