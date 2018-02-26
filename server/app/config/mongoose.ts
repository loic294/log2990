// tslint:disable:no-floating-promises
import * as mongoose from "mongoose";
import config from "../config";
mongoose.connect(config.mongo);

const db: mongoose.Connection = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    // Needed to know if we are connected to the db
    // tslint:disable-next-line:no-console
    console.log("Connected to the db.");
});

export default mongoose;
