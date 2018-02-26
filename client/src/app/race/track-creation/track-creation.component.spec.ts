// tslint:disable:no-magic-numbers no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { TrackCreationComponent } from "./track-creation.component";
import { DebugElement } from "@angular/core";
import { Object3D, Line } from "three";

describe("TrackCreationComponent", () => {
    let component: TrackCreationComponent;
    let fixture: ComponentFixture<TrackCreationComponent>;
    let debugElement: DebugElement;
    let scene: THREE.Scene;
    let vertices: Array<Object3D>;
    let edges: Array<Line>;
    let tackIsCompleted: boolean;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackCreationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        scene = component.getScene();
        vertices = component.getDotCommand().getVertices();
        edges = component.getDotCommand().getEdges();
        tackIsCompleted = component.getDotCommand().getTrackIsCompleted();
        debugElement = fixture.debugElement.query(By.all());
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("scene should be empty", () => {
        expect(scene.children.length).toBe(1);
    });

    it("should place a dot in scene", () => {
        debugElement.triggerEventHandler("mousedown", { offsetX: 1, offsetY: 1 });
        expect(scene.children.length).toBe(1);
        expect(vertices.length).toBe(1);
    });

    it("should place two dots and a line in scene", () => {
        debugElement.triggerEventHandler("mousedown", { offsetX: 1, offsetY: 1 });
        debugElement.triggerEventHandler("mousedown", { offsetX: 2, offsetY: 2 });
        expect(scene.children.length).toBe(3);
        expect(vertices.length).toBe(2);
        expect(edges.length).toBe(1);
    });

    it("should place three dots and three lines in scene and should complete track", () => {
        debugElement.triggerEventHandler("mousedown", { pageX: 1, pageY: 1 });
        debugElement.triggerEventHandler("mousedown", { pageX: 2, pageY: 2 });
        debugElement.triggerEventHandler("mousedown", { pageX: 3, pageY: 3 });
        debugElement.triggerEventHandler("mousedown", { pageX: 1, pageY: 1 });
        expect(scene.children.length).toBe(6);
        expect(vertices.length).toBe(3);
        expect(edges.length).toBe(3);
        expect(tackIsCompleted).toBe(true);
    });

});
