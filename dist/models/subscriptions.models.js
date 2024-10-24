"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class SubscriptionModel extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.users, { foreignKey: 'subscription_id' });
    }
    static initModel(sequelize) {
        return super.init({
            name: {
                type: sequelize_1.DataTypes.STRING,
                unique: true
            },
            product_id: {
                type: sequelize_1.DataTypes.STRING,
                unique: true
            },
            price_id: {
                type: sequelize_1.DataTypes.STRING,
            }
        }, {
            sequelize,
            tableName: 'subscriptions',
            modelName: 'subscriptions'
        });
    }
}
exports.default = SubscriptionModel;
