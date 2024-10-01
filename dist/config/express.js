"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routers_1 = __importDefault(require("../routers"));
const celebrate_1 = require("celebrate");
const morgan_1 = __importDefault(require("morgan"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT;
    }
    middleware() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.app.use((0, express_fileupload_1.default)({ debug: true }));
    }
    routers() {
        (0, routers_1.default)(this.app);
        this.app.use((0, celebrate_1.errors)());
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Express running on ${this.port}`);
        });
    }
    core() {
        this.middleware();
        this.routers();
        this.listen();
    }
}
exports.default = new Server();
