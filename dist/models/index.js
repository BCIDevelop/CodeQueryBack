"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
const models = {};
let sequelize;
const node_env = process.env.NODE_ENV;
if (node_env)
    sequelize = new sequelize_1.Sequelize(database_1.default[node_env]);
else {
    (0, dotenv_1.config)();
    sequelize = new sequelize_1.Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD || "",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: process.env.DB_DRIVER,
        timezone: process.env.TZ,
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        dialectOptions: {
            ssl: false
        },
    });
}
(0, fs_1.readdirSync)(__dirname)
    .filter((file) => {
    let fileSplit = file.split(".");
    return fileSplit.length === 3 && fileSplit[1] === "models";
})
    .forEach((file) => {
    const nameModel = file.split(".")[0];
    const importModel = require((0, path_1.resolve)(__dirname, file));
    models[nameModel] = importModel.default.initModel(sequelize);
});
Object.values(models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(models));
const object = Object.assign(Object.assign({}, models), { sequelize,
    Sequelize: sequelize_1.Sequelize });
exports.default = object;
