/* tslint:disable */
import { TrackInformationService } from "./trackInformationService";
import { assert } from "chai";
import { ITrack } from "../../models/trackInfo";

const trackService: TrackInformationService = new TrackInformationService();

describe("trackInformationService", () => {

    describe("POST et GET", () => {
        it("should save new track named track1 and get track named track1", async () => {
            const tempObject: ITrack = { name: "track1", type: "type1", description: "desc", timesPlayed: 0 };
            trackService.putTrack(tempObject);
            let tempTrack: ITrack;
            await trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[tempArray.length - 1];
            });
            assert.equal(tempTrack.name, "track1");
            assert.equal(tempTrack.type, "type1");
            assert.equal(tempTrack.description, "desc");
            assert.equal(tempTrack.timesPlayed, 0);
        });
    });

    describe("POST et GET all", () => {
        it("should save new track named track2 and get list of track names : track1 and track 2", async () => {
            const tempObject: Object = { name: "track2", type: "type1", description: "desc", timesPlayed: 0 };
            let tempArray: Array<String>;
            trackService.putTrack(tempObject);
            await trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            });
            assert.equal(tempArray[tempArray.length - 2], "track1");
            assert.equal(tempArray[tempArray.length - 1], "track2");
        });
    });

    describe("PATCH", () => {
        it("should modify description of track1", async () => {
            let track1Desc1: String;
            let track1Desc2: String;
            let tempTrack: ITrack;

            await trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[tempArray.length - 1];
                track1Desc1 = tempTrack.description;
            });

            tempTrack.description = "new description";
            await trackService.patchTrack("track1", tempTrack);

            await trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[0];
                track1Desc2 = tempTrack.description;
            });

            assert.notEqual(track1Desc1, track1Desc2);
        });
    });

    describe("DELETE", () => {
        it("BD should contain 2 tracks less after deleting track1 and track 2", async () => {
            let tempArray: Array<String>;
            let BdSize: number;
            await trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            });

            BdSize = tempArray.length;
            await trackService.deleteTrack("track1");
            await trackService.deleteTrack("track2");
            await trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            });

            assert.equal(tempArray.length, BdSize - 2);
        });
    });

});
