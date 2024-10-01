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
const nodemailer_1 = require("nodemailer");
class EmailServer {
    constructor() {
        this.host = process.env.MAIL_SERVER || "";
        this.port = Number(process.env.MAIL_PORT) || 587;
        this.username = process.env.MAIL_USERNAME || "";
        this.password = process.env.MAIL_PASSWORD || "";
        const smtpConfig = {
            host: this.host,
            port: this.port,
            auth: {
                user: this.username,
                pass: this.password
            }
        };
        this.client = (0, nodemailer_1.createTransport)(smtpConfig);
    }
    send(to, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.sendMail({
                from: this.username,
                to,
                subject,
                html
            });
        });
    }
    resetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailer = yield this.send(email, 'New Password', `Your new Password is : <b>${password} </b>`);
            }
            catch (error) {
            }
        });
    }
}
exports.default = new EmailServer();
