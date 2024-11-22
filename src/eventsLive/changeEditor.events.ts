import { Socket } from "socket.io"

export default async(socket:Socket)=> { 
    socket.on('changeEditor',async (value)=>{
        const questionId = socket.handshake.query.questionId as string
        socket.broadcast.in(`question${questionId}`).emit('incommingEditorChange',value)  
    })
}