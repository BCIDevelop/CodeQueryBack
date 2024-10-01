import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class AnswerModel extends Model {
   
    static associate(models:Models){
        this.belongsTo(models.questions,{
            foreignKey:'question_id',
            targetKey:'id'
        })
        this.belongsTo(models.users,{
            foreignKey:'user_id',
            targetKey:'id'
        })
        
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                body:{
                    type:DataTypes.TEXT,
                },
                image:{
                    type:DataTypes.STRING,
                    allowNull:true
                },
                question_id:{
                    type:DataTypes.INTEGER,
                },
                user_id:{
                    type:DataTypes.INTEGER,
                },
                is_accepted:{
                    type:DataTypes.BOOLEAN,
                    defaultValue:false
                }

            },
            {
                sequelize,
                tableName:'answers',
                modelName:'answers'
            }
        );
    }

}

export default AnswerModel