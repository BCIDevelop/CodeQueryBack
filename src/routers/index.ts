import {readdirSync} from "fs"
import {resolve} from "path"
import { Express } from "express"
export default (express: Express)=>{
    readdirSync(__dirname)
    .filter((file)=>{
       let fileSplit=file.split(".")
       return fileSplit.length===3 && fileSplit[1]==="routes"
    }).forEach((file)=>{
        const context=file.split(".")[0]
        const route=require(resolve(__dirname,file))
        express.use(`/${context}`,route.default.init())


    })
}