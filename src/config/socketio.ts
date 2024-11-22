import {Server} from "socket.io"
import eventModules from "../events"
import eventsLive from "../eventsLive";
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
        this.server.of('live').on('connection',async (socket)=>{
            console.log(`Conexion con el socket live --> ${socket.id}`)
            const questionId = socket.handshake.query.questionId
            if(questionId) socket.join(`question${questionId}`);
            await eventsLive(socket,this.server.of('live'))
       
        })
    }
}
export default SocketIO 