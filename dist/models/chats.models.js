"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class ChatModel extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.messages, { foreignKey: 'chat_id' });
    }
    static initModel(sequelize) {
        return super.init({
            sender_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            receiver_id: {
                type: sequelize_1.DataTypes.INTEGER,
            }
        }, {
            sequelize,
            tableName: 'chats',
            modelName: 'chats'
        });
    }
}
exports.default = ChatModel;
