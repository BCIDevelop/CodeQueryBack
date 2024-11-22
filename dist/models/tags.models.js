"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class TagModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsToMany(models.questions, { through: 'question_tags' });
    }
    static initModel(sequelize) {
        return super.init({
            name: {
                type: sequelize_1.DataTypes.STRING,
                unique: true
            }
        }, {
            sequelize,
            tableName: 'tags',
            modelName: 'tags'
        });
    }
}
exports.default = TagModel;
