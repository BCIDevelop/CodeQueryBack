"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class ClassRoomModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsToMany(models.users, { through: 'student_classrooms' });
        this.belongsTo(models.users, {
            foreignKey: 'owner_id',
            targetKey: 'id'
        });
        this.hasMany(models.questions, { foreignKey: 'classroom_id' });
        this.hasMany(models.answers, { foreignKey: 'classroom_id' });
    }
    static initModel(sequelize) {
        return super.init({
            classroom_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
            },
            owner_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
        }, {
            sequelize,
            tableName: 'classrooms',
            modelName: 'classrooms'
        });
    }
}
exports.default = ClassRoomModel;
