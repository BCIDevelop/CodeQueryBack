"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HealthController {
    check(req, res) {
        return res.status(200).send();
    }
}
exports.default = HealthController;
