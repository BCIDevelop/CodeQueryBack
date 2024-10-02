"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class StudentClassroomModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        this.belongsTo(models.classrooms, { foreignKey: 'classroom_id', onDelete: 'CASCADE' });
    }
    static initModel(sequelize) {
        return super.init({
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            classroom_id: {
                type: sequelize_1.DataTypes.INTEGER,
            }
        }, {
            sequelize,
            tableName: 'student_classrooms',
            modelName: 'student_classrooms'
        });
    }
}
exports.default = StudentClassroomModel;
