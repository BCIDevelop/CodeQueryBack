import { Socket } from "socket.io"


export default async(socket:Socket)=> { 
    socket.on('disconnect',async ()=>{
        const chatId = socket.handshake.query.chatId as string
        socket.broadcast.in(chatId).emit('leave')
    })
}