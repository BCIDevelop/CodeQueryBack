"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class MessageModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.chats, {
            foreignKey: 'chat_id',
            targetKey: 'id'
        });
    }
    static initModel(sequelize) {
        return super.init({
            message: {
                type: sequelize_1.DataTypes.TEXT,
            },
            chat_id: {
                type: sequelize_1.DataTypes.INTEGER,
            }
        }, {
            sequelize,
            tableName: 'messages',
            modelName: 'messages'
        });
    }
}
exports.default = MessageModel;
