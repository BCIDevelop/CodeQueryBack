"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class QuestionModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        this.belongsTo(models.classrooms, {
            foreignKey: 'classroom_id',
            targetKey: 'id'
        });
        this.hasMany(models.answers, { foreignKey: 'question_id' });
        this.belongsToMany(models.tags, { through: 'question_tags' });
    }
    static initModel(sequelize) {
        return super.init({
            title: {
                type: sequelize_1.DataTypes.STRING,
            },
            body: {
                type: sequelize_1.DataTypes.TEXT,
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            classroom_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: "PENDING"
            }
        }, {
            sequelize,
            tableName: 'questions',
            modelName: 'questions'
        });
    }
}
exports.default = QuestionModel;
