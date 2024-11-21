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
const vm_1 = __importDefault(require("vm"));
exports.default = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('execute', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const questionId = socket.handshake.query.questionId;
            socket.broadcast.in(`question${questionId}`).emit('running');
            const outputs = [];
            let { language, value } = data;
            const allowedLanguages = ['python', 'typescript', 'php', 'sql', 'java', 'javascript'];
            const limitCredits = 20;
            if (!allowedLanguages.includes(language)) {
                io.in(`question${questionId}`).emit('compiled', { output: "Please use an allowed Language" });
                return;
            }
            const axiosClient = axios_1.default.create({
                baseURL: 'https://api.jdoodle.com/v1',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (data.language === 'javascript') {
                
                const sandbox = { Math,
                    console: {
                        log: (...args) => {
                            outputs.push(args.join(' '));
                        },
                    },
                    Function: undefined, global: undefined, process: undefined };
                vm_1.default.createContext(sandbox);
                new vm_1.default.Script(value);
                console.log(outputs.join('\n'));
                io.in(`question${questionId}`).emit('compiled', { output: outputs.join('\n') });
            }
            else {
                const responseCredits = yield axiosClient.post('/credit-spent', {
                    clientId: process.env.JDOODLE_APP_ID,
                    clientSecret: process.env.JDOODLE_APP_SECRET
                });
                if (responseCredits.data.used === limitCredits) {
                    io.in(`question${questionId}`).emit('compiled', { output: "Free Limit Reached\nPleas feel free to use only JS" });
                    return;
                } // emit some event or disconnet with a message
                if (language === 'python')
                    language = "python3";
                const response = yield axiosClient.post('/execute', {
                    script: value,
                    language,
                    versionIndex: "0",
                    clientId: process.env.JDOODLE_APP_ID,
                    clientSecret: process.env.JDOODLE_APP_SECRET
                });
                io.in(`question${questionId}`).emit('compiled', response.data);
            }
        }
        catch (error) {
            console.log('error', error);
        }
    }));
});
