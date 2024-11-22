import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class TagModel extends Model {
   
    static associate(models:Models){
        this.belongsToMany(models.questions, { through: 'question_tags' });
        
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                name:{
                    type:DataTypes.STRING,
                    unique:true
                }
            },
            {
                sequelize,
                tableName:'tags',
                modelName:'tags'
            }
        );
    }

}

export default TagModel