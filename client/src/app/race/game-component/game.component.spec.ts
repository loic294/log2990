// tslint:disable:no-magic-numbers

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { GameComponent } from "./game.component";
import { TrackProgressionService } from "../trackProgressionService";
import { Raycaster, Vector3, Intersection } from "three";

describe("GameComponent", () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [GameComponent],
            providers: [TrackProgressionService]
        })
            .compileComponents().catch((error) => {
                throw error;
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should load track", async () => {
        component.trackInformation.track = {name: "track1", vertice: [[1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1]]};
        const objectsInScene: number = component.service.scene.children.length;
        await component.ngAfterViewInit();
        component.showTrack();
        expect(component.service.scene.children.length).toBeGreaterThan(objectsInScene);
        expect(component.trackLoaded).toBe(true);
    });

    it("should start race", async () => {
        component.trackInformation.track = {name: "track1", vertice: [[1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1]]};
        const objectsInScene: number = component.service.scene.children.length;
        await component.ngAfterViewInit();
        component.showTrack();
        await component.start();
        expect(component.service.scene.children.length).toBeGreaterThan(objectsInScene);
        expect(component.raceStarted).toBe(true);
    });

    it("user should have access to track list", async () => {
        component.trackInformation.tracks = ["tracks1", "tracks2"];
        expect(component.trackInformation.tracks).toBeTruthy();
    });

    it("user should have access to track information", async () => {
        component.trackInformation.track = {name: "track1", type: "test", description: "desc"};
        expect(component.trackInformation.track.name).toBe("track1");
        expect(component.trackInformation.track.type).toBe("test");
        expect(component.trackInformation.track.description).toBe("desc");
    });

    it("track should have one more plane (texture)", async () => {
        component.trackInformation.track = {name: "track1", vertice: [[1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1]]};
        await component.ngAfterViewInit();
        component.showTrack();
        await component.start();

        const origin1: Vector3 = new Vector3(0, 1, 1);
        const direction: Vector3 = new Vector3(0, -1, 0);

        const origin2: Vector3 = new Vector3(0, 1, 25);

        const raycaster1: Raycaster = new Raycaster(origin1, direction, 1, -10);
        const raycaster2: Raycaster = new Raycaster(origin2, direction, 1, -10);

        const intersected1: Intersection[] = raycaster1.intersectObjects(component.service.scene.children);
        const intersected2: Intersection[] = raycaster2.intersectObjects(component.service.scene.children);

        expect(intersected1.length).toBe(2);
        expect(intersected2.length).toBe(1);
    });

});
