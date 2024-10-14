import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class MessageModel extends Model {

    static associate(models:Models){
        this.belongsTo(models.chats,{
            foreignKey:'chat_id',
            targetKey:'id',
            onDelete: 'CASCADE'
        })
        this.belongsTo(models.users,{
            foreignKey:'owner_id',
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
                },
                owner_id:{
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