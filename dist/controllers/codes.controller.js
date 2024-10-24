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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const codes_exceptions_1 = require("../exceptions/codes.exceptions");
class CodeController {
    constructor() {
        this.axiosClient = axios_1.default.create({
            baseURL: 'https://api.jdoodle.com/v1',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.limitCredit = 20;
        this.allowedLanguages = ['python', 'typescript', 'php', 'sql', 'java'];
    }
    getExecutedCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { code, language } = req.body;
                if (!this.allowedLanguages.includes(language))
                    throw new codes_exceptions_1.CodesNotFound();
                const responseCredits = yield this.axiosClient.post('/credit-spent', {
                    clientId: process.env.JDOODLE_APP_ID,
                    clientSecret: process.env.JDOODLE_APP_SECRET
                });
                if (responseCredits.data.used === this.limitCredit)
                    return res.status(204).json();
                if (language === 'python')
                    language = 'python3';
                const response = yield this.axiosClient.post('/execute', {
                    script: code,
                    language: language,
                    versionIndex: "0",
                    clientId: process.env.JDOODLE_APP_ID,
                    clientSecret: process.env.JDOODLE_APP_SECRET
                });
                return res.status(200).json(response.data);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = CodeController;
