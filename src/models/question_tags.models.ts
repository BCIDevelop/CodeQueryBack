import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class QuestionTagModel extends Model {
   
    static associate(models:Models){
        this.belongsTo(models.questions, { foreignKey: 'question_id', onDelete: 'CASCADE' });
        this.belongsTo(models.tags, { foreignKey: 'tag_id', onDelete: 'CASCADE' });
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                question_id:{
                    type:DataTypes.INTEGER,
                },
                tag_id:{
                    type:DataTypes.INTEGER,
                }
            },
            {
                sequelize,
                tableName:'question_tags',
                modelName:'question_tags'
            }
        );
    }

}

export default QuestionTagModel