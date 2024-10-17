import {Model,DataTypes, Sequelize} from 'sequelize'
import { Models } from '../types/sequelize.type';


class StudentClassroomModel extends Model {
   
    static associate(models:Models){
        
        this.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        this.belongsTo(models.classrooms, { foreignKey: 'classroom_id', onDelete: 'CASCADE' });
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
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
                tableName:'student_classrooms',
                modelName:'student_classrooms'
            }
        );
    }

}

export default StudentClassroomModel