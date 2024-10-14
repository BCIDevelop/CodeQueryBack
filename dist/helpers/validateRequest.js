"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validatePassword = void 0;
const validatePassword = (password) => {
    const patternMayus = /^(?=.*[A-Z]).*$/;
    const patternLength = /^[A-Za-z\d]{8,}$/;
    if (!patternMayus.test(password))
        return { valid: false, text: "At least one UpperCase" };
    if (!patternLength.test(password))
        return { valid: false, text: "At least 8 character length" };
    return { valid: true, text: "" };
};
exports.validatePassword = validatePassword;
const validateEmail = (email) => {
    const patternEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.(com)$/;
    if (!patternEmail.test(email))
        return { valid: false, text: "Have to be an email" };
    return { valid: true, text: "" };
};
exports.validateEmail = validateEmail;
