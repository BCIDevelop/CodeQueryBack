import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { QuestionNotFound } from "../exceptions/questions.exceptions";
import { AuthenticatedRequest } from "../types/request.type";
import { Op } from "sequelize";
class ClassroomController{
    private model:any

    constructor(){
        this.model=models.questions
    }
    
    async listRecords(req: Request, res: Response) {
        try {
            const { page, per_page } = req.query;
            const { limit, offset } = paginationField(Number(page), Number(per_page));
            const  {id}=req.params
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: {
                    exclude: ['user_id', 'classroom_id'],
                },
                where: {
                    classroom_id:id,
                    status: {
                        [Op.ne]: 'SOLVED' 
                    }
                },
                order: [
                    ['id', 'ASC']
                ],
                include: [{
                    model: models.users,
                    attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                }]
            });
    
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
    async createRecords(req:AuthenticatedRequest,res:Response){

        try{
            const transaction = await this.model.sequelize.transaction();
            console.log(req.body)
            req.body.user_id = req.current_user
            const record=this.model.build(req.body)

            await record.save()
            if (req.body.tags) {
                
                await record.addTags(req.body.tags, { transaction });
            }
            await transaction.commit();
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
            if (!record) throw new QuestionNotFound()
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
            if (!record) throw new QuestionNotFound()
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
            if (!record) throw new QuestionNotFound()
            record.destroy()
            return res.status(200).json({message:'Classroom Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
}
export default ClassroomController