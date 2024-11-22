
import models from "../models"
import { RoleNotFound } from "../exceptions/roles.exceptions"
import { Request,Response } from "express"
import {paginationField,paginatioResults} from '../helpers/pagination'
class TagController{
    private model:any
    constructor(){
        this.model=models.tags
    }
    async listRecords(req:Request,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            const records=await this.model.findAndCountAll({
                limit,
                offset,
                order:[
                    ['id','ASC']
                ],
            })
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        }
        catch(error:any){
            return res.status(500).json({message:error.message})
        }
    }
    async createRecord(req:Request,res:Response){
        try{
            const record=this.model.build(req.body)
            await record.save()

            return res.status(201).json({record})
        }
        catch(error:any){
            return res.status(500).json({message:error.message})
        }
    }
    async getRecordById(req:Request,res:Response){
        try{
            const {id}=req.params
            const record=await this.model.findOne({
                where:{
                    id,
                }
            })
            if(!record) throw new RoleNotFound()
              

            return res.status(200).json(record)
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
    
}
export default TagController