import { TestBed, inject } from "@angular/core/testing";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { SocketService } from "../socket.service/socket.service";
import { DifficultyService } from "./../difficulty.service/difficulty.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("SocketService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SocketIoModule.forRoot(config),
      ],
      providers: [
        SocketService,
        DifficultyService
      ]
    });
  });

  it("should be created", inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});
