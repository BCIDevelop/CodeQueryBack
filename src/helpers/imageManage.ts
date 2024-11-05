import { UploadedFile } from "express-fileupload";
export const validateImage = (image:UploadedFile)=>{
    const acceptedMimetypes=['application/jpg','image/png','application/jpeg']
    const {name,mimetype} = image
    if(!acceptedMimetypes.includes(mimetype)) throw new Error("File must be png,jpeg,jpg")
    return name
}

export const addSugar = (name:string,user_id:string)=>{
    const nameArray = name.split(".")
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');        
    const year = now.getFullYear();                             
    const hours = String(now.getHours()).padStart(2, '0');    
    const minutes = String(now.getMinutes()).padStart(2, '0'); 
    const seconds = String(now.getSeconds()).padStart(2, '0'); 
    const sugarName= `${month}-${day}-${year}T${hours}${minutes}${seconds}`; 
    nameArray.splice(1, 0, sugarName);
    nameArray.pop()
    const fileName = nameArray.join('.')
    return `${user_id}/${fileName}`;
}