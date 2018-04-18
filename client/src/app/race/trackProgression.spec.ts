import { TrackProgression } from "./trackProgression";
import { Vector3, Object3D } from "three";
import { Car } from "./car/car";
import { TrackProgressionService } from "./trackProgressionService";

const MAX_LAPS: number = 3;

describe("TrackProgression", () => {
    let trackProgression: TrackProgression;

    beforeEach(() => {
        const firstVertex: Object3D = new Object3D();
        firstVertex.translateOnAxis(new Vector3(1, 0, 0), 1);
        const secondVertex: Object3D = new Object3D();
        secondVertex.translateOnAxis(new Vector3(2, 0, 0), 1);
        const thirdVertex: Object3D = new Object3D();
        thirdVertex.translateOnAxis(new Vector3(2, 2, 0), 1);
        const fourthVertex: Object3D = new Object3D();
        fourthVertex.translateOnAxis(new Vector3(1, 2, 0), 1);

        const player: Car = new Car();
        const bot1: Car = new Car();
        const bot2: Car = new Car();
        const bot3: Car = new Car();

        trackProgression = new TrackProgression(new Vector3(1, 0, 0), player, new Array(bot1, bot2, bot3),
                                                new TrackProgressionService,
                                                new Array(firstVertex, secondVertex, thirdVertex, fourthVertex));
    });

    it("should be created", () => {
        expect(trackProgression).toBeTruthy();
    });

    it("should require 3 laps from the player to end game", async() => {
        await trackProgression.player.init();
        await trackProgression.bots[0].init();
        await trackProgression.bots[1].init();
        await trackProgression.bots[2].init();

        trackProgression.player.userData.lapsCompleted = MAX_LAPS;
        trackProgression.checkRaceProgress();
        expect(trackProgression.game.gameIsFinished).toBe(true);
    });

    it("should simulate reasonable times for npcs after race is completed", async() => {
        await trackProgression.player.init();
        await trackProgression.bots[0].init();
        await trackProgression.bots[1].init();
        await trackProgression.bots[2].init();

        trackProgression.player.userData.lapsCompleted = MAX_LAPS;
        trackProgression.checkRaceProgress();

        expect(trackProgression.game.botTimes[0][0]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[0][1]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[0][2]).toBeGreaterThan(0);

        expect(trackProgression.game.botTimes[1][0]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[1][1]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[1][2]).toBeGreaterThan(0);

        expect(trackProgression.game.botTimes[2][0]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[2][1]).toBeGreaterThan(0);
        expect(trackProgression.game.botTimes[2][2]).toBeGreaterThan(0);
    });

    it("should not increment currentLap since the player did not do a complete lap", async() => {
        await trackProgression.player.init();
        await trackProgression.bots[0].init();
        await trackProgression.bots[1].init();
        await trackProgression.bots[2].init();

        const currentLap: number = trackProgression.game.currentLap;
        trackProgression.player.userData.verticeIndex = 0;
        trackProgression.player.userData.isNewLap = true;
        trackProgression.player.meshPosition = trackProgression.vertice[0].position;

        trackProgression.checkRaceProgress();
        expect(trackProgression.game.currentLap).toBe(currentLap);
    });

    it("should increment currentLap since the player did a complete lap", async() => {
        await trackProgression.player.init();
        await trackProgression.bots[0].init();
        await trackProgression.bots[1].init();
        await trackProgression.bots[2].init();

        const currentLap: number = trackProgression.game.currentLap;
        trackProgression.player.userData.verticeIndex = trackProgression.vertice.length - 1;
        trackProgression.player.userData.isNewLap = true;
        trackProgression.player.meshPosition = trackProgression.vertice[0].position;

        trackProgression.checkRaceProgress();
        expect(trackProgression.game.currentLap).toBe(currentLap + 1);
    });

});
