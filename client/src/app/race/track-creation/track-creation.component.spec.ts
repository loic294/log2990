// tslint: disable: no-magic-numbers no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TrackCreationComponent } from "./track-creation.component";
import { Object3D, Line } from "three";

describe("TrackCreationComponent", () => {
    let component: TrackCreationComponent;
    let fixture: ComponentFixture<TrackCreationComponent>;
    let scene: THREE.Scene;
    let vertices: Array<Object3D>;
    let edges: Array<Line>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TrackCreationComponent]
        })
            .compileComponents().catch((error) => {
                throw error;
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        scene = component.scene;
        vertices = component.dotCommand.getVertices();
        edges = component.dotCommand.getEdges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("scene should be empty", () => {
        expect(scene.children.length).toBe(1);
    });

    it("should place a dot in scene", () => {
        const event: MouseEvent = new MouseEvent("mousedown");
        component.onKeyDown(event);
        expect(scene.children.length).toBe(2);
        expect(vertices.length).toBe(1);
    });

    it("should place two dots and a line in scene", () => {

        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventDown2: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");

        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        component.onKeyDown(eventDown2);

        expect(scene.children.length).toBe(4);
        expect(vertices.length).toBe(2);
        expect(edges.length).toBe(1);
    });

    it("should place three dots and three lines in scene, should complete track and should not add 4th dot.", () => {
        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown2: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        component.onKeyDown(eventDown2);
        component.onKeyUp(eventUp);
        const eventDown3: MouseEvent = new MouseEvent("mousedown", { clientX: 300, clientY: 50 });
        component.onKeyDown(eventDown3);
        component.onKeyUp(eventUp);
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown4: MouseEvent = new MouseEvent("mousedown", { clientX: 150, clientY: 150 });
        component.onKeyDown(eventDown4);
        component.onKeyUp(eventUp);

        expect(scene.children.length).toBe(7);
        expect(vertices.length).toBe(3);
        expect(edges.length).toBe(3);
        expect(component.dotCommand.getTrackIsCompleted()).toBe(true);
    });

    it("should place a single dot, no line and track should not be completed", () => {
        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);

        expect(scene.children.length).toBe(2);
        expect(vertices.length).toBe(1);
        expect(edges.length).toBe(0);
        expect(component.dotCommand.getTrackIsCompleted()).toBe(false);
    });

    it("constraints not respected so should not save.", () => {
        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown2: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        component.onKeyDown(eventDown2);
        component.onKeyUp(eventUp);
        const eventDown3: MouseEvent = new MouseEvent("mousedown", { clientX: 300, clientY: 50 });
        component.onKeyDown(eventDown3);
        component.onKeyUp(eventUp);
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown4: MouseEvent = new MouseEvent("mousedown", { clientX: 150, clientY: 150 });
        component.onKeyDown(eventDown4);
        component.onKeyUp(eventUp);

        component.save();

        expect(component.isSaved()).toBe(false);
    });

    it("track not in cycle so should not save.", () => {
        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown2: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        component.onKeyDown(eventDown2);
        component.onKeyUp(eventUp);
        const eventDown3: MouseEvent = new MouseEvent("mousedown", { clientX: 300, clientY: 50 });
        component.onKeyDown(eventDown3);
        component.onKeyUp(eventUp);

        component.save();

        expect(component.isSaved()).toBe(false);
    });

    it("should give track name 'test1' and description 'desc'", () => {
        component.trackInformation.track.name = "test1";
        component.trackInformation.track.description = "desc";
        expect(component.trackInformation.track.name).toBe("test1");
        expect(component.trackInformation.track.description).toBe("desc");
    });

    it("should load track name 'test' and change trackLength after removing connecting edge.", () => {
        component.getTrackInfo("test");
        const nbSceneChildren: number = component.scene.children.length;
        component.dotCommand.remove();
        const eventDown1: MouseEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 50 });
        const eventUp: MouseEvent = new MouseEvent("mouseup");
        component.onKeyDown(eventDown1);
        component.onKeyUp(eventUp);
        const eventDown2: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        component.onKeyDown(eventDown2);
        expect(component.scene.children.length).toBeGreaterThan(nbSceneChildren);
    });

    it("should load track name 'test' and unsuccessfuly add new object", () => {
        component.getTrackInfo("test");
        const nbSceneChildren: number = component.scene.children.length;
        const eventDown: MouseEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 100 });
        component.onKeyDown(eventDown);
        expect(component.scene.children.length).toBe(nbSceneChildren);
    });

    it("should load track name 'test' and save new track by changing name", () => {
        component.trackInformation.getTracksList();
        const numberOfTracks: number = component.trackInformation.tracks.length;
        component.getTrackInfo("test");
        component.trackInformation.track.name = "test2";
        component.save();
        expect(component.trackInformation.tracks.length).toBe(numberOfTracks + 1);
    });

    it("should load track name 'test2' and overwrite track 'test2'", () => {
        component.trackInformation.getTracksList();
        const numberOfTracks: number = component.trackInformation.tracks.length;
        component.getTrackInfo("test2");
        component.trackInformation.track.description = "new description";
        component.save();
        expect(component.trackInformation.tracks.length).toBe(numberOfTracks);
        component.getTrackInfo("test2");
        expect(component.trackInformation.track.description).toBe("new description");
    });

    it("should delete track name 'test2'", () => {
        component.trackInformation.getTracksList();
        const numberOfTracks: number = component.trackInformation.tracks.length;
        component.getTrackInfo("test2");
        component.deleteTrack();
        expect(component.trackInformation.tracks.length).toBe(numberOfTracks - 1);
    });

});
