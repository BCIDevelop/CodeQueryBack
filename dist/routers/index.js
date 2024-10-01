"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (express) => {
    (0, fs_1.readdirSync)(__dirname)
        .filter((file) => {
        let fileSplit = file.split(".");
        return fileSplit.length === 3 && fileSplit[1] === "routes";
    }).forEach((file) => {
        const context = file.split(".")[0];
        const route = require((0, path_1.resolve)(__dirname, file));
        express.use(`/${context}`, route.default.init());
    });
};
