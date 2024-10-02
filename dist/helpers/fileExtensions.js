"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExtensions = void 0;
const fileExtensions = (joi) => ({
    type: 'file',
    base: joi.any(),
    messages: {
        'file.base': '"{{#label}}" debe ser un archivo',
        'file.invalidType': '"{{#label}}" debe ser un archivo PNG o JPG',
    },
    coerce(value, helpers) {
        if (value && value.size && value.path) {
            const fileExtension = value.path.split('.').pop().toLowerCase();
            // Verificar si la extensión es PNG o JPG
            if (fileExtension[1] === 'png' || fileExtension[1] === 'jpg' || fileExtension[1] === 'jpeg') {
                return { value };
            }
            else {
                return { value, errors: helpers.error('file.invalidType') };
            }
        }
        return { value, errors: helpers.error('file.base') };
    },
});
exports.fileExtensions = fileExtensions;
