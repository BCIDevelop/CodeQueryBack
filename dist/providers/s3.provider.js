"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
class BucketS3 {
    constructor(folder) {
        this.accessKeyId = process.env.AWS_ACCESS_KEY || "";
        this.secretKeyId = process.env.AWS_SECRET_KEY || "";
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.folder = folder;
        this.bucketRegion = process.env.AWS_BUCKET_REGION;
        this.client = new client_s3_1.S3Client({
            region: this.bucketRegion,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretKeyId
            }
        });
    }
    uploadFile(file, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyFile = `${this.folder}/${fileName}.png`;
                let url = `https://${this.bucketName}.s3.amazonaws.com/${keyFile}`;
                const objectFile = {
                    Bucket: this.bucketName,
                    Key: keyFile,
                    Body: file.data,
                    ACL: 'public-read'
                };
                yield this.client.send(new client_s3_1.PutObjectCommand(objectFile));
                return url;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = BucketS3;
