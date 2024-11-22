import { Server, Socket } from "socket.io"
import models from '../models'
export default async(socket:Socket,io:Server)=> { 
        
        socket.on('join',async ()=>{
        
            try{
                const chatId = socket.handshake.query.chatId as string
                const sockets = await io.in(chatId).fetchSockets();
                if(sockets.length>1) io.in(chatId).emit('online')
                else socket.broadcast.in(chatId).emit('online')
                const record = await models.messages.findAndCountAll({
                    limit:7,
                    offset:0,
                    attributes:{
                        exclude:['chat_id']
                    },
                    where:{
                         chat_id:chatId
                    }
                    ,
                    order:[
                        ['created_at','DESC']
                    ]
                })
              
            io.to(chatId).emit('allMessages',{results:record.rows})  
            }
            catch(error){
                console.log(error)
            }
           
    })
}