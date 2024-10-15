import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class ClassRoomModel extends Model {

    static associate(models:Models){
        this.belongsToMany(models.users, { through: 'student_classrooms' });
        this.belongsTo(models.users,{
            foreignKey:'owner_id',
            targetKey:'id'
        })
        this.hasMany(models.questions,{foreignKey:'classroom_id'})
        this.hasMany(models.answers,{foreignKey:'classroom_id'})
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                classroom_name:{
                    type:DataTypes.STRING,  

                },
                description:{
                    type:DataTypes.STRING,
                },
                owner_id:{
                    type:DataTypes.INTEGER,
                },

            },
            {
                sequelize,
                tableName:'classrooms',
                modelName:'classrooms'
            }
        );
    }

}

export default ClassRoomModel