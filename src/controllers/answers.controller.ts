import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import { Request,Response } from 'express';
import { AuthenticatedRequest } from "../types/request.type";
import { UploadedFile } from "express-fileupload";
import BucketS3 from "../providers/s3.provider";
import { addSugar, validateImage } from "../helpers/imageManage";
import { AnswerNotFound } from "../exceptions/answers.exceptions";
import { QuestionNotFound } from "../exceptions/questions.exceptions";

class AnswerController{
    private model:any
    private bucket:BucketS3
    constructor(){
        this.model=models.answers
        this.bucket=new BucketS3('answers')
    }
    async listRecordsByClassrooms(req:Request,res:Response){
        try {
            const { page, per_page } = req.query;
            const { limit, offset } = paginationField(Number(page), Number(per_page));
            const  {classroom_id}=req.params
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: ['created_at'],
                where: {
                    classroom_id
                },
                
                order: [
                    ['id', 'ASC']
                ],
                
            });
    
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }

    }
    async listRecords(req: Request, res: Response) {
        try {
            const { page, per_page } = req.query;
            const { limit, offset } = paginationField(Number(page), Number(per_page));
            const  {question_id}=req.params
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: {
                    exclude: ['question_id', 'user_id'],
                },
                where: {
                    question_id  
                },
                order: [
                    ['id', 'ASC']
                ],
                include: [{
                    model: models.users,
                    attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                },
                ]
            });
    
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }
    async createRecords(req:AuthenticatedRequest,res:Response){
        try{
           
            req.body.user_id = req.current_user
            if(req.files){
                const name = validateImage(req.files.image as UploadedFile)
                /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,addSugar(name,req.current_user as string)) */
                req.body['image']="test"
            }
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
                    exclude:['question_id', 'user_id']
                },
                where:{
                    id
                },
                include: [{
                    model: models.users,
                    attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                },
                ]
            })
            if (!record) throw new AnswerNotFound()
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
            const record=await this.model.findOne({
                attributes:{
                    exclude:['user_id']
                },
                where:{
                    id,
                }
            })
            if (!record) throw new AnswerNotFound()
            if(files){
                validateImage(files.image as UploadedFile)
                /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,record.image) */
                req.body['image']="test"
            }
            if(body.is_accepted){
                const record_question =await models.questions.findOne({
                    attributes:{
                        exclude:["user_id","classroom_id"]  
                    },
                    where:{
                        id:record.question_id
                    }
                })
                if (!record_question) throw new QuestionNotFound()
                record_question.status = 'SOLVED'
                await record_question.update(record_question.dataValues,{ transaction })
            }
            await record.update(body,{ transaction })
            await transaction.commit()
            return res.status(200).json({message:'Answer Updated'})
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
            if (!record) throw new AnswerNotFound()
            record.destroy()
            return res.status(200).json({message:'Answer Eliminated'})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})
        }
    }
    async listScoreStudent(req:AuthenticatedRequest,res:Response){
        try {
            const {classroom_id,user_id} = req.params
            const { page, per_page } = req.query;
            const { limit, offset } = paginationField(Number(page), Number(per_page));
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: ["created_at"],
                where: {
                    classroom_id ,
                    user_id
                },
            })
            return res.status(200).json(paginatioResults(records, Number(page), Number(per_page)));
        } catch (error:any) {
            console.log(error)
            return res.status(error?.code|| 500).json({message:error.message})
        }
       

    }
}
export default AnswerController