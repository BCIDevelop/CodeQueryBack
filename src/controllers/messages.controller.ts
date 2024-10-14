import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { AuthenticatedRequest } from "../types/request.type";
import {  ChatNotFound } from "../exceptions/chats.exceptions";
import { MessageNotFound } from "../exceptions/messages.exceptions";
class MessageController{
    private model:any
    private chatModel:any
    constructor(){
        this.model=models.messages
        this.chatModel = models.chats
    }
  
    async listRecords(req:AuthenticatedRequest,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            const {id} = req.params
            const records= await this.model.findAndCountAll({
                limit,
                offset,
                attributes:{
                    exclude:['chat_id']
                },
                where:{
                     chat_id:id
                }
                ,
                order:[
                    ['created_at','ASC']
                ]
            })
           
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }
    
    async createRecords(req:AuthenticatedRequest,res:Response){
        try{
            const {message,chat_id} =req.body
            const owner_id = req.current_user
            const record_chat =await this.chatModel.findOne({
                where:{
                   id:chat_id
                }
            })
            if(!record_chat) throw new ChatNotFound()
            const record=this.model.build({message,chat_id,owner_id})
            await record.save()
            return res.status(201).json(record)
        }
        catch(error:any){
            return res.status(500).json({message:error.message})
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
            if (!record) throw new MessageNotFound()
            record.destroy()
            return res.status(200).json({message:'Message Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
    
}






export default MessageController