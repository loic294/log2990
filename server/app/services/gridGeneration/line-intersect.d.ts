// tslint:disable:only-arrow-functions
// Requis puisque ça ne fonctionne pas avec une arrow function puisque
// ça doit suivre la signature de la function dans la librairie utilisée.
declare module "line-intersect" {

    function checkIntersection(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number
    ): { point: { x: number; y: number; }; type: string; };

}
