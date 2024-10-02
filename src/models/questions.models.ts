import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class QuestionModel extends Model {
   
    static associate(models:Models){
        
        this.belongsTo(models.users,{
            foreignKey:'user_id',
            targetKey:'id'
        })
        this.belongsTo(models.classrooms,{
            foreignKey:'classroom_id',
            targetKey:'id'
        })
        this.hasMany(models.answers,{foreignKey:'question_id'})
        this.belongsToMany(models.tags, { through: 'question_tags' });
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                title:{
                    type:DataTypes.STRING,
                    unique:true,
                },
                body:{
                    type:DataTypes.TEXT,
                },
                image:{
                    type:DataTypes.STRING,
                    allowNull:true,
                },
                user_id:{
                    type:DataTypes.INTEGER,
                },
                classroom_id:{
                    type:DataTypes.INTEGER,
                },
                status:{
                    type:DataTypes.STRING,
                    defaultValue:"PENDING"
                }   


            },
            {
                sequelize,
                tableName:'questions',
                modelName:'questions'
            }
        );
    }

}

export default QuestionModel