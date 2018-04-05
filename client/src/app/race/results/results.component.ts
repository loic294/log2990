import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"]
})
export class ResultsComponent implements OnInit {
    private _isHidden: boolean;

    public constructor() {
        this._isHidden = true;
    }

    public show(): void {
        this._isHidden = false;
    }

    public get isHidden(): boolean {
        return this._isHidden;
    }

    // tslint:disable-next-line:typedef
    public ngOnInit() {
    }

}
