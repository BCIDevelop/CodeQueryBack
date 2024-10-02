"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class QuestionTagModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.questions, { foreignKey: 'question_id', onDelete: 'CASCADE' });
        this.belongsTo(models.tags, { foreignKey: 'tag_id', onDelete: 'CASCADE' });
    }
    static initModel(sequelize) {
        return super.init({
            question_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            tag_id: {
                type: sequelize_1.DataTypes.INTEGER,
            }
        }, {
            sequelize,
            tableName: 'question_tags',
            modelName: 'question_tags'
        });
    }
}
exports.default = QuestionTagModel;
