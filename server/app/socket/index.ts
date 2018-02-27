import * as fs from "fs";

// Il n'est pas possible d'importer les types pour Socket
// tslint:disable-next-line:no-any
export default (socket: any) => {

    fs.readdirSync(__dirname).forEach((filename: string) => {

    if (!filename.includes("index") && !filename.includes("spec") && !filename.includes("map") && !filename.includes("types")) {
        const socketFromFile: Function = require(`${__dirname}/${filename}`).default;
        socketFromFile(socket);
    }

  });
};
