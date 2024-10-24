import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class SubscriptionModel extends Model {
    static associate(models:Models){
        this.hasMany(models.users,{foreignKey:'subscription_id'})
    }

    static initModel(sequelize:Sequelize){
        return super.init(
            {
                name:{
                    type:DataTypes.STRING,
                    unique:true
                },
                product_id:{
                    type:DataTypes.STRING,
                    unique:true
                },
                price_id:{
                    type:DataTypes.STRING,
                }
            },
            {
                sequelize,
                tableName:'subscriptions',
                modelName:'subscriptions'
            }
        );
    }

}

export default SubscriptionModel