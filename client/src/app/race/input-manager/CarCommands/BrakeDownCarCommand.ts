import AbsCarCommand from "./AbsCarCommand";

export default class BrakeDownCarCommand extends AbsCarCommand {
    public subscribe(): void {
        this.car.brake();
        console.log("MAX EN X DE LA BOITE:" + this.car.boundingBox.max.x);
        console.log("MAX EN Y DE LA BOITE:" + this.car.boundingBox.max.y);
        console.log("MAX EN Z DE LA BOITE:" + this.car.boundingBox.max.z);
        console.log("MIN EN X DE LA BOITE:" + this.car.boundingBox.min.x);
        console.log("MIN EN Y DE LA BOITE:" + this.car.boundingBox.min.y);
        console.log("MIN EN Z DE LA BOITE:" + this.car.boundingBox.min.z);
        console.log("X DU CENTRE DE LA BOITE:" + this.car.boundingBox.getCenter().x);
        console.log("Y DU CENTRE DE LA BOITE:" + this.car.boundingBox.getCenter().y);
        console.log("Z DU CENTRE DE LA BOITE:" + this.car.boundingBox.getCenter().z);
        console.log("X DE LA VOTURE:" + this.car.meshPosition.x);
        console.log("Y DE LA VOTURE:" + this.car.meshPosition.y);
        console.log("Z DE LA VOITURE" + this.car.meshPosition.z);

    }
}
