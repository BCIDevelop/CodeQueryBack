import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { ClassroomNotFound, StudentNotInClassroom } from "../exceptions/classrooms.exceptions";
import { AuthenticatedRequest } from "../types/request.type";
import { Model, Op, where } from "sequelize";
import { RecordModel } from "../types/sequelize.type";
import EmailServer from '../providers/mail.provider'
import { UserNotFound } from "../exceptions/users.exceptions";
import { createToken, verifyToken } from "../helpers/jwt";
class ClassroomController{
    private model:any
    private modelUsers:any
    private modelStudentClassroom:any
    constructor(){
        this.model=models.classrooms
        this.modelUsers=models.users
        this.modelStudentClassroom = models.student_classrooms
    }
    async listRecordsAdmin(req:Request,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            const records= await this.model.findAndCountAll({
                limit,
                offset,
                attributes:{
                    exclude:['owner_id']
                },
                order:[
                    ['id','ASC']
                ]
            })
           
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }
    async listRecords(req:AuthenticatedRequest,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            const id = req.current_user
            const records= await this.model.findAndCountAll({
                limit,
                offset,
                attributes:{
                    exclude:['owner_id']
                },
                where:{
                    owner_id : Number(id)
                }
                ,
        
                include: [{
                    model: models.questions,
                    attributes: ['id'],
                    
                },
                ]
            })
            
            const recordOrdered = records.rows.sort((a:RecordModel,b:RecordModel)=>{
                return b.questions!.length - a.questions!.length 
            })
            records.rows= recordOrdered 
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }
    async createRecords(req:Request,res:Response){
        try{
            const record=this.model.build(req.body)
            await record.save()
            return res.status(201).json(record)
        }
        catch(error:any){
            return res.status(500).json({message:error.message})
        }
    }
    async getRecordById(req:AuthenticatedRequest,res:Response){
        try{
            const  {id}=req.params
            const record=await this.model.findOne({
                attributes:{
                    exclude:['owner_id']
                },
                where:{
                    [Op.and]: [
                       
                        { id }
                    ]
                }
            })
            if (!record) throw new ClassroomNotFound()
            return res.status(200).json(record)
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})


        }
    }
    async updateRecordById(req:Request,res:Response){
        try{
            let {body,files,params}=req
            const  {id}=params
            
            const record=await this.model.findOne({
                attributes:{
                    exclude:["owner_id"]  
                },
                where:{
                    id,
                }
            })
            if (!record) throw new ClassroomNotFound()
            record.update(body)

            return res.status(200).json({message:'Classroom Updated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})


        }
    }

    async deleteRecordById(req:Request,res:Response){
        try{
            const  {id}=req.params
            const record=await this.model.findOne({
                where:{
                    id,
                }
            })
            if (!record) throw new ClassroomNotFound()
            record.destroy()
            return res.status(200).json({message:'Classroom Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
    /* STUDENTS COTROLLER LOGIC */
    async listRecordsStudents(req:AuthenticatedRequest,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            const {id} = req.params
            const recordsStudents= await models.student_classrooms.findAndCountAll({
                limit,
                offset,
                attributes: ["status"], 
                where:{
                    classroom_id : id
                }
                ,

                include: [{
                    model: models.users,
                    attributes: ['id', 'name', 'last_name', 'avatar', 'email','created_at'],
                    
                },
                ]
            })
        
            return res.status(200).json(paginatioResults(recordsStudents,Number(page),Number(per_page)))
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }
    async createRecordsStudents(req:AuthenticatedRequest,res:Response){
        try{
            const {id} = req.params
            const {email} = req.body
            const teacherId = req.current_user
            const record= await this.model.findOne({
                attributes:{
                    exclude:['user_id','classroom_id']
                },
                where:{
                    id
                },
                include: {
                    model: models.users,
                    as: 'owner', 
                    attributes: ['name', 'last_name', 'avatar'],
                    
                },
                
            })
            if(!record) throw new ClassroomNotFound()
            const recordUser = await this.modelUsers.findOne({
                attributes:{
                    exclude:["password","token","active_status","last_message"]  
                },
                where:{
                    email
                }
            })
            if(!recordUser) throw new UserNotFound()
            if(recordUser.rol_id == 2) return res.status(400).json({ message: "User is a teacher." })
            
            const isUserAlreadyInClassroom = await record.hasUsers(recordUser.id);
            if (isUserAlreadyInClassroom) return res.status(400).json({ message: "User is already assigned to this classroom." })
            await record.addUsers([recordUser.id],{through:{status:"PENDING"}})
            const token = createToken({id:teacherId,classroom:record.id})
            const client_url = process.env.CLIENT_URL
            const content = record.owner.avatar
            ?`Accept Invitation : <button> <a href='${client_url}/confirmClassroom?name=${record.owner.name}&classroom_id=${id}&token=${token}&avatar=${record.owner.avatar}'>Confirm invitation</a> </button>`
            :`Accept Invitation : <button> <a href='${client_url}/confirmClassroom?name=${record.owner.name}&classroom_id=${id}&token=${token}'>Confirm invitation</a> </button>`
            await EmailServer.send(email,`Invitation to classroom ${record.classroom_name}`,content)

            return res.status(201).json(recordUser)
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }

    async confirmStudentClassroom(req:AuthenticatedRequest,res:Response){
        try {
            const {token} = req.body
            const user_id = req.current_user
            const payload = verifyToken(token) as {classroom:string}
            const record = this.model.findOne({
                attributes:["id"],
                where:{
                    id:payload.classroom
                }
            })
            if(!record) throw new ClassroomNotFound()
            const [updated] = await this.modelStudentClassroom.update(
                { status: "ACTIVE" },  // Lo que se quiere actualizar
                {
                    where: {
                        classroom_id: payload.classroom,
                        user_id: user_id,
                        status: "PENDING" // Añade cualquier condición extra si es necesario
                    },
                }
            )
            if (updated === 0) throw new StudentNotInClassroom();
            
            return res.status(204).json();
        } 
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
       
    }

    async createBulkStudents(req:AuthenticatedRequest,res:Response){
        const {users} = req.body
        const {id} = req.params
        const record= await this.model.findOne({

            attributes:{
                exclude:['user_id','classroom_id']
            },
            where:{
                id
            }
        })
        if(!record) throw new ClassroomNotFound()
        const usersClassroom =await record.getUsers()
        
        usersClassroom.forEach((element:{dataValues:{id:number}}) => {
            
            if(users.includes(element.dataValues.id)) return res.status(400).json({ message: "Some user is already assigned to this classroom." })    
        });
        await record.addUsers(users)
        return res.status(201).json({message:"Students added"})
    }
    async deleteStudent(req:AuthenticatedRequest,res:Response){
        const {id,user_id} = req.params
            
            const record= await this.model.findOne({

                attributes:{
                    exclude:['user_id','classroom_id']
                },
                where:{
                    id
                }
            })
            if(!record) throw new ClassroomNotFound()
            await record.removeUsers(user_id)
            return res.status(200).json({message:"Students deleted"})
    }
    
}






export default ClassroomController