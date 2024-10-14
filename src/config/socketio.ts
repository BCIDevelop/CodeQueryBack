import {Server} from "socket.io"
import eventModules from "../events"

import http from "http";
class SocketIO{
    private express:http.Server
    private server: Server;

    constructor(express:http.Server){
        this.express=express
        this.server=new Server(this.express,{
            cors:{
                origin:"*",
            }
        })

    }
    init(){
       
        this.events()
    }
    events(){
        this.server.on('connection',async (socket)=>{
            console.log(`Conexion con el socket --> ${socket.id}`)
            const chatId = socket.handshake.query.chatId
            if(chatId) socket.join(chatId);
            await eventModules(socket,this.server)
       
        })
    }
}
export default SocketIO 