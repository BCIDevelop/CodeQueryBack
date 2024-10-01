
import {S3Client,PutObjectCommand,PutObjectCommandInput } from '@aws-sdk/client-s3'
import { UploadedFile } from 'express-fileupload'
class BucketS3{
    private accessKeyId: string
    private secretKeyId:string
    private bucketName:string | undefined
    private bucketRegion:string | undefined
    private folder:string
    private client:S3Client
    constructor(folder:string){
        this.accessKeyId=process.env.AWS_ACCESS_KEY || ""
        this.secretKeyId=process.env.AWS_SECRET_KEY || ""
        this.bucketName=process.env.AWS_BUCKET_NAME 
        this.folder=folder
        this.bucketRegion=process.env.AWS_BUCKET_REGION
        this.client=new S3Client({
            region:this.bucketRegion,
            credentials:{
                accessKeyId:this.accessKeyId,
                secretAccessKey:this.secretKeyId
            }
        })
    }
    async uploadFile(file:UploadedFile,fileName:string){
        try{
            const keyFile=`${this.folder}/${fileName}.png`
            let url = `https://${this.bucketName}.s3.amazonaws.com/${keyFile}`
            const objectFile:PutObjectCommandInput ={
                Bucket:this.bucketName,
                Key:keyFile,
                Body:file.data,
                ACL:'public-read'
            }
           await this.client.send(new PutObjectCommand(objectFile))
           return url
    
        }catch(error:any){
            throw new Error(error.message)
        }

    }
}
export default BucketS3