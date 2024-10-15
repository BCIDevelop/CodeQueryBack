import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { ClassroomNotFound } from "../exceptions/classrooms.exceptions";
import { AuthenticatedRequest } from "../types/request.type";
import { Model, Op } from "sequelize";
import { RecordModel } from "../types/sequelize.type";
class ClassroomController{
    private model:any

    constructor(){
        this.model=models.classrooms
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
                        { owner_id: req.current_user },
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
                attributes: [], 
                where:{
                    classroom_id : id
                }
                ,

                include: [{
                    model: models.users,
                    attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id'],
                    
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
            const {user_id} = req.body
            const record= await this.model.findOne({

                attributes:{
                    exclude:['user_id','classroom_id']
                },
                where:{
                    id
                }
            })
            if(!record) throw new ClassroomNotFound()
            const isUserAlreadyInClassroom = await record.hasUsers(user_id);
            if (isUserAlreadyInClassroom) return res.status(400).json({ message: "User is already assigned to this classroom." })
            await record.addUsers([user_id])
            return res.status(201).json({message:"Student added"})
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }

    async createBulkStudents(req:AuthenticatedRequest,res:Response){
        const {users} = req.body
        const {id} = req.params
        console.log(users)
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
}






export default ClassroomController