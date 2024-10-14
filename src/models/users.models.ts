import {Model,DataTypes, Sequelize, InferAttributes, InferCreationAttributes} from 'sequelize'
import {hashSync,genSaltSync, compareSync} from 'bcryptjs'
import auth from '../config/auth'
import { Models } from '../types/sequelize.type'
class UserModel extends Model<InferAttributes<UserModel>,InferCreationAttributes<UserModel>>{
    public password!: string;
    static associate(models:Models){
        this.belongsToMany(models.classrooms, { through: 'student_classrooms' });
        this.belongsTo(models.roles,{
            foreignKey:'rol_id',
            targetKey:'id'
        })
        this.hasMany(models.classrooms,{foreignKey:'owner_id'})
        this.hasMany(models.questions,{foreignKey:'user_id'})
        this.hasMany(models.answers,{foreignKey:'user_id'})
        this.hasMany(models.chats,{foreignKey:'receiver_id'})
        this.hasMany(models.chats,{foreignKey:'sender_id'})
        this.hasMany(models.messages,{foreignKey:'owner_id'})
    }
    static initModel(sequelize:Sequelize){
        return super.init(
            {
                name:{
                    type:DataTypes.STRING,
                },
                last_name:{
                    type:DataTypes.STRING,
                },
                email:{
                    type:DataTypes.STRING,
                    unique:true
                },
                password:{
                    type:DataTypes.STRING,
                },
                avatar:{
                    type:DataTypes.STRING,
                    allowNull:true,

                }
                ,
                token:{
                    type:DataTypes.STRING,
                    allowNull:true,

                }
                ,
                rol_id:{
                    type:DataTypes.INTEGER,
                },
                active_status:{
                    type:DataTypes.BOOLEAN,
                    defaultValue:false // false
                },
                last_message:{
                    type:DataTypes.STRING,
                    allowNull:true,
                }
            },
            {
                sequelize,
                tableName:'users',
                modelName:'users'
            }
        )
    }
    async hashPassword(){
        let passwordHash=hashSync(this.password,genSaltSync(auth.rounds))
        this.password=passwordHash
    }
    async validatePassword(password:string){
        console.log("Password",this.password)
        return compareSync(password,this.password)
    }
}
export default UserModel