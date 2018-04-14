import { TrackBuilder } from "./trackBuilder";
import { Scene, Vector3, Object3D } from "three";
import { Car } from "./car/car";

describe("TrackBuilder", () => {
    let trackBuilder: TrackBuilder;

    beforeEach(() => {
        const firstVertex: Object3D = new Object3D();
        firstVertex.translateOnAxis(new Vector3(1, 0, 0), 1);
        const secondVertex: Object3D = new Object3D();
        secondVertex.translateOnAxis(new Vector3(2, 0, 0), 1);

        const player: Car = new Car();
        const bot1: Car = new Car();
        const bot2: Car = new Car();
        const bot3: Car = new Car();
        trackBuilder = new TrackBuilder(new Scene(), new Array(firstVertex, secondVertex),
                                        new Array(), player, new Array(bot1, bot2, bot3));
    });

    it("should be created", () => {
        expect(trackBuilder).toBeTruthy();
    });

    it("should position 4 cars on 2 starting lines (cars should not have same positions)", async() => {
        await trackBuilder.playerCar.init();
        await trackBuilder.bots[0].init();
        await trackBuilder.bots[1].init();
        await trackBuilder.bots[2].init();
        trackBuilder.buildTrack();
        expect(trackBuilder.bots[0].meshPosition.x).toBeGreaterThan(0);
        expect(trackBuilder.bots[1].meshPosition.x).toBeGreaterThan(0);
        expect(trackBuilder.bots[2].meshPosition.x).toBeGreaterThan(0);
        expect(trackBuilder.playerCar.meshPosition.x).toBeGreaterThan(0);
        expect(trackBuilder.playerCar.meshPosition).not.toBe(trackBuilder.bots[0].meshPosition);
        expect(trackBuilder.bots[0].meshPosition).not.toBe(trackBuilder.bots[1].meshPosition);
        expect(trackBuilder.bots[1].meshPosition).not.toBe(trackBuilder.bots[2].meshPosition);
        expect(trackBuilder.bots[2].meshPosition).not.toBe(trackBuilder.playerCar.meshPosition);
    });

});
