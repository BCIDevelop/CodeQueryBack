"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSugar = exports.validateImage = void 0;
const validateImage = (image) => {
    const acceptedMimetypes = ['application/jpg', 'image/png', 'application/jpeg'];
    const { name, mimetype } = image;
    if (!acceptedMimetypes.includes(mimetype))
        throw new Error("File must be png,jpeg,jpg");
    return name;
};
exports.validateImage = validateImage;
const addSugar = (name, user_id) => {
    const nameArray = name.split(".");
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const sugarName = `${month}-${day}-${year}T${hours}${minutes}${seconds}`;
    nameArray.splice(1, 0, sugarName);
    const fileName = nameArray.join('.');
    return `${user_id}/${fileName}`;
};
exports.addSugar = addSugar;
