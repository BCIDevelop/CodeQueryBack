import models from "../models";
import {paginationField,paginatioResults} from '../helpers/pagination'
import BucketS3 from "../providers/s3.provider";
import { UserNotFound } from "../exceptions/users.exceptions";
import { Request,Response } from 'express';
import  { UploadedFile } from 'express-fileupload';
import { Transaction } from "sequelize";
class UserController{
    private model:any
    private bucket:BucketS3
    constructor(){
        
        this.model=models.users
        this.bucket=new BucketS3('avatars')
        
    }
    async listRecords(req:Request,res:Response){
        try{
            const {page,per_page}=req.query
            const {limit,offset}=paginationField(Number(page),Number(per_page))
            
            const records= await this.model.findAndCountAll({
                limit,
                offset,
                attributes:{
                    exclude:['password']
                },
                where:{
                    active_status:true
                }
                ,
                order:[
                    ['id','ASC']
                ],
                include:[{
                    model:models.roles,
                    attributes:['id','name']
                }]
            })
           
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        }
        catch(error:any){
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }
    async createRecords(req:Request,res:Response){
        const transaction: Transaction = await this.model.sequelize.transaction();
        try{
            const record=this.model.build(req.body)
            await record.hashPassword()
            await record.save()
            if(req.files){
                const acceptedMimetypes=['application/jpg','image/png','application/jpeg']
                const avatar=req.files!.avatar as UploadedFile
                if(!acceptedMimetypes.includes(avatar.mimetype)) throw new Error("File must be png,jpeg,jpg")
                /* const urlAvatar=await this.bucket.uploadFile(avatar,record.id) */
                req.body['avatar']="test"
            }
            await transaction.commit()
            return res.status(201).json(record)
        }
        catch(error:any){
            await transaction.rollback()
            return res.status(500).json({message:error.message})
        }
    }
    async getRecordById(req:Request,res:Response){
        try{
            const  {id}=req.params
            const record=await this.model.findOne({
                attributes:{
                    exclude:["password"]  
                },
                where:{
                    id,
                }
            })
            if (!record) throw new UserNotFound()
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
                    exclude:["password"]  
                },
                where:{
                    id,
                }
            })
            if (!record) throw new UserNotFound()
            if (files){
                const avatar=req.files!.avatar as UploadedFile
                const urlAvatar=await this.bucket.uploadFile(avatar,id)
                body["avatar"]=urlAvatar
            }
            record.update(body)

            return res.status(200).json({message:'User Updated'})
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
            if (!record) throw new UserNotFound()
            record.update({status:false})
            return res.status(200).json({})
        }
        catch(error:any){
            return res.status(error?.code|| 500).json({message:error.message})


        }
    }
}
export default UserController