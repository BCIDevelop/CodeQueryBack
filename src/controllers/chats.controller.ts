import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { AuthenticatedRequest } from "../types/request.type";
import { ChatFound, ChatNotFound } from "../exceptions/chats.exceptions";
import { UserNotFound } from "../exceptions/users.exceptions";
import { Op } from "sequelize";
class ChatController{
    private model:any
    private userModel:any
    constructor(){
        this.model=models.chats
        this.userModel = models.users
    }
  
    async listRecords(req: AuthenticatedRequest, res: Response) {
        try {
            const { page, per_page } = req.query;
            const { limit, offset } = paginationField(Number(page), Number(per_page));
            const user_id = req.current_user;
    
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: {
                    exclude: ['sender_id']
                },
                include: [
                    {
                        model: models.users,
                        as: 'sender',
                        attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id'],
                    },
                    {
                        model: models.users,
                        as: 'receiver',
                        attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id'],
                    }
                ],
                where: {
                    [Op.or]: [
                        { sender_id: user_id },
                        { receiver_id: user_id }
                    ]
                },
                order: [
                    ['id', 'ASC']
                ]
            });
    
          
            const recordsFiltered = records.rows.map((element: any) => {
               
                if (element.sender.id === user_id) {
                    return {
                        id: element.id,
                        user: element.receiver 
                    };
                }
                
                return {
                    id: element.id,
                    user: element.sender
                };
            });

            records.rows = recordsFiltered
            // Devuelve los resultados filtrados con paginación
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
    
    
    async createRecords(req:AuthenticatedRequest,res:Response){
        try{
            const {email} =req.body
            const record_user = await this.userModel.findOne({
                attributes:{
                    exclude:['password','token']
                },
                where:{
                   email
                }
            })
            if(!record_user) throw new UserNotFound()
            const sender_id = req.current_user
            const receiver_id = record_user.id
            const record_chat =await this.model.findOne({
                where:{
                    receiver_id,
                    sender_id
                }
            })
            if(record_chat) throw new ChatFound()
            const record=this.model.build({sender_id,receiver_id})
            await record.save()
            return res.status(201).json({id:record.id,user:record_user})
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
            if (!record) throw new ChatNotFound()
            record.destroy()
            return res.status(200).json({message:'Chat Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
    
}






export default ChatController