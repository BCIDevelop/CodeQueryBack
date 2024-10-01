import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class MessageModel extends Model {

    static associate(models:Models){
        this.belongsTo(models.chats,{
            foreignKey:'chat_id',
            targetKey:'id'
        })
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                message:{
                    type:DataTypes.TEXT,
                },
                chat_id:{
                    type:DataTypes.INTEGER,
                }
                
            },
            {
                sequelize,
                tableName:'messages',
                modelName:'messages'
            }
        );
    }

}

export default MessageModel