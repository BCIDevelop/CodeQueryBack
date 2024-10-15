import { Server, Socket } from "socket.io"
import models from '../models'
export default async(socket:Socket,io:Server)=> { 
        
        socket.on('message',async (data,ack)=>{
            try {
                const chat_id = socket.handshake.query.chatId as string
                const {message,owner_id} = data
                const record=models.messages.build({message,chat_id,owner_id})
                await record.save()
                const recordUser =await models.users.findOne({
                    where:{
                        id:owner_id
                    },
                })
                recordUser.last_message = message 
                await recordUser.save()
                socket.broadcast.in(chat_id).emit('incommingMessage',record)  
                ack({ success: true, record })
            } catch (error:any) {
                console.error("Error saving message:", error);
                ack({ success: false, error: error.message })
            }
          
    })
}