import { TestBed, inject } from "@angular/core/testing";

import { SocketService } from "./socket.service";
import * as io from "socket.io-client";

describe("SocketService", () => {

    let socket: SocketIOClient.Socket;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SocketService]
        });
    });

    beforeEach((done: () => void) => {
        socket = io.connect("http://localhost:3000", {});
        socket.on("connect", () => {
            done();
        });
        socket.on("disconnect", () => { });
    });

    afterEach((done: () => void) => {
        if (socket.connected) {
            socket.disconnect();
        }
    });

    it("should be created", inject([SocketService], (service: SocketService) => {
        expect(service).toBeTruthy();
    }));
});
