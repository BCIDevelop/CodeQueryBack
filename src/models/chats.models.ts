import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class ChatModel extends Model {

    static associate(models:Models){
        this.hasMany(models.messages,{foreignKey:'chat_id'})
        this.belongsTo(models.users,{
            foreignKey:'receiver_id',
            as: 'receiver',
            targetKey:'id'
        })
        this.belongsTo(models.users,{
            foreignKey:'sender_id',
            as: 'sender',
            targetKey:'id'
        })
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                sender_id:{
                    type:DataTypes.INTEGER,

                },
                receiver_id:{
                    type:DataTypes.INTEGER,

                }
            },
            {
                sequelize,
                tableName:'chats',
                modelName:'chats'
            }
        );
    }

}

export default ChatModel