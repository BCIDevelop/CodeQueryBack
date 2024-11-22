import {readdirSync} from "fs"
import {resolve} from "path"
import { DefaultEventsMap, Namespace, Server, Socket } from "socket.io"

export default async (socket:Socket,io:Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>)=>{
    readdirSync(__dirname)
    .filter((file)=>{
        let fileSplit=file.split(".")
        return fileSplit.length===3 && fileSplit[1]==="events"
    }).forEach(async (file)=>{
        const event=require(resolve(__dirname,file))
        await event.default(socket,io)
    })
}