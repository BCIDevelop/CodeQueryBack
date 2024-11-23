import { readdirSync } from "fs";
import { resolve } from "path";
import config from "../config/database";
import Sequelize from "sequelize";

const models = {};
const sequelize = new Sequelize(config[process.env.NODE_ENV]);

readdirSync(__dirname)
  .filter((file) => {
    let fileSplit = file.split(".");
    return fileSplit.length === 3 && fileSplit[1] === "models";
  })
  .forEach((file) => {
    const nameModel = file.split(".")[0];
    const importModel = require(resolve(__dirname, file));
    models[nameModel] = importModel.default.initModel(sequelize);
  });

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

module.exports = {
  ...models,
  sequelize,
  Sequelize,
};