import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { QuestionNotFound } from "../exceptions/questions.exceptions";
import { AuthenticatedRequest } from "../types/request.type";
import { Op } from "sequelize";
import { UploadedFile } from "express-fileupload";
import BucketS3 from "../providers/s3.provider";
import { addSugar, validateImage } from "../helpers/imageManage";

class QuestionController{
    private model:any
    private bucket:BucketS3
    constructor(){
        this.model=models.questions
        this.bucket=new BucketS3('questions')
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
                },
                {
                    model: models.tags,
                    attributes: ['name'],
                    through: { attributes: [] }
                    
                }
                
                ]
            });
    
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
    async createRecords(req:AuthenticatedRequest,res:Response){
        const transaction = await this.model.sequelize.transaction();
        try{
           
            req.body.user_id = req.current_user
            if(req.files){
                const name = validateImage(req.files.image as UploadedFile)
                /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,addSugar(name,req.current_user as string)) */
                req.body['image']="test"
            }
            const record=this.model.build(req.body)
            await record.save()
            if (req.body.tags) {
                await record.addTags(req.body.tags, { transaction });
            }
            await transaction.commit();
            return res.status(201).json(record)
        }
        catch(error:any){   
            await transaction.rollback()
            return res.status(500).json({message:error.message})
        }
    }
    async listMyRecords(req:AuthenticatedRequest,res:Response){
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
                    user_id:req.current_user,
                },
                order: [
                    ['id', 'ASC']
                ],
                include: [
                {
                    model: models.tags,
                    attributes: ['name'],
                    through: { attributes: [] }
                    
                }
                
                ]
            });
    
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }




    async getRecordById(req:AuthenticatedRequest,res:Response){
        try{
            const  {id}=req.params
            const record=await this.model.findOne({
                attributes:{
                    exclude:['user_id', 'classroom_id']
                },
                where:{
                    [Op.and]: [
                        { user_id: req.current_user },
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
        const transaction = await this.model.sequelize.transaction();
        try{
        
            let {body,files,params}=req
            const  {id}=params
            const {tags} = body
            const record=await this.model.findOne({
                attributes:{
                    exclude:["user_id","classroom_id"]  
                },
                where:{
                    id,
                }
            })
            if (!record) throw new QuestionNotFound()
            if(files){
                validateImage(files.image as UploadedFile)
                /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,record.image) */
                req.body['image']="test"
            }
            if(tags) await record.setTags(tags, { transaction });
            record.update(body)
            await transaction.commit()
            return res.status(200).json({message:'Classroom Updated'})
        }
        catch(error:any){
            await transaction.rollback()
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
            return res.status(200).json({message:'Question Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
}
export default QuestionController