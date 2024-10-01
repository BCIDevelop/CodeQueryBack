import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { ClassroomNotFound } from "../exceptions/classrooms.exceptions";
import { AuthenticatedRequest } from "../types/request.type";
import { Op } from "sequelize";
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
            record.delete()
            return res.status(200).json({})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})


        }
    }
}
export default ClassroomController