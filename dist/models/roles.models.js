"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class RoleModel extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.users, {
            foreignKey: 'rol_id'
        });
    }
    static initModel(sequelize) {
        return super.init({
            name: {
                type: sequelize_1.DataTypes.STRING,
            }
        }, {
            sequelize,
            tableName: 'roles',
            modelName: 'roles'
        });
    }
}
exports.default = RoleModel;
