/// <reference types="socket.io" />
import * as fs from "fs";

// Socket.io ne semble pas avoir un type pour le socket.
export default (socket: any) => {

    fs.readdirSync(__dirname).forEach((filename: string) => {

    if (!filename.includes(".js")) {
        const socketFromFile: Function = require(`${__dirname}/${filename}`).default;
        socketFromFile(socket);
    }

  });
};
