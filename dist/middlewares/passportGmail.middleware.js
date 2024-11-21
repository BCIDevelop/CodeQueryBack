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
exports.passportGmailCallback = exports.passportGmailConfiguration = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const models_1 = __importDefault(require("../models"));
const jwt_1 = require("../helpers/jwt");
const passportGmailConfiguration = (req, res, next) => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/gmail/callback`,
        scope: ['profile', 'email'],
        state: false,
        passReqToCallback: true
    }, (req, res, accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        
        try {
            const profile_email = profile.emails[0].value;
            const name = profile.name.givenName;
            const last_name = profile.name.familyName;
            const avatar = profile.photos[0].value ? profile.photos[0].value : null;
            const userBody = { name, last_name, avatar, rol_id: 1, active_status: true, password: "testpassword", email: profile_email };
            const record = yield models_1.default.users.findOne({
                where: {
                    email: profile_email
                }
            });
            if (!record) {
                const userRecord = models_1.default.users.build(userBody);
                yield userRecord.hashPassword();
                const userStored = yield userRecord.save();
                userBody.id = userStored.id;
            }
            else
                userBody.id = record.id;
            return cb(null, userBody);
        }
        catch (error) {
            console.log(error);
            return cb(error, undefined);
        }
    })));
    passport_1.default.authenticate('google', { session: false })(req, res, next);
};
exports.passportGmailConfiguration = passportGmailConfiguration;
const passportGmailCallback = (req, res, next) => {
    passport_1.default.authenticate('google', { session: false }, (err, userBody) => {
        if (err || !userBody)
            return res.redirect(`${process.env.CLIENT_URL}/error`);
        const { accessToken, refreshToken } = (0, jwt_1.createTokens)({ id: userBody.id });
        const { email, id, rol_id, name, last_name, avatar } = userBody;
        const url = avatar
            ? `${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}&avatar=${avatar}`
            : `${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}`;
        return res.redirect(url);
    })(req, res, next);
};
exports.passportGmailCallback = passportGmailCallback;
