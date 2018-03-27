import { TestBed, inject } from "@angular/core/testing";
import { Socket, SocketIoConfig, SocketIoModule } from "ng-socket-io";

import { SocketService } from "./socket.service";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { GridLoadingService } from "../grid-loading.service/grid-loaing.service";


describe("SocketService", () => {

    const config: SocketIoConfig = { url: "http://localhost:4200", options: {} };
    let socketService: SocketService;

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

    beforeEach(() => {
        socketService = new SocketService(new Socket(config), new DifficultyService(), new GridLoadingService());
    });

    it("should be created", inject([SocketService, GridLoadingService], (service: SocketService) => {
        expect(service).toBeTruthy();
    }));
});
