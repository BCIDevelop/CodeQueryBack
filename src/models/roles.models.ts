import {Model,DataTypes, Sequelize, Optional} from 'sequelize'
import { Models } from '../types/sequelize.type';


class RoleModel extends Model {
    public id!: number;
    public name!: string;
    static associate(models:Models){
        
        this.hasMany(models.users,{
            foreignKey:'rol_id'
        })
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                name:{
                    type:DataTypes.STRING,

                }
            },
            {
                sequelize,
                tableName:'roles',
                modelName:'roles'
            }
        );
    }

}

export default RoleModel