"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fs_1.readdirSync)(__dirname)
        .filter((file) => {
        let fileSplit = file.split(".");
        return fileSplit.length === 3 && fileSplit[1] === "events";
    }).forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        const event = require((0, path_1.resolve)(__dirname, file));
        yield event.default(socket, io);
    }));
});
