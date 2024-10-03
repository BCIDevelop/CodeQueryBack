"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class AnswerModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.questions, {
            foreignKey: 'question_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
        this.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'id'
        });
    }
    static initModel(sequelize) {
        return super.init({
            body: {
                type: sequelize_1.DataTypes.TEXT,
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            question_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            is_accepted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize,
            tableName: 'answers',
            modelName: 'answers'
        });
    }
}
exports.default = AnswerModel;
