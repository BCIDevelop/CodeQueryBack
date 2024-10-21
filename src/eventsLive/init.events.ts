import { Server, Socket } from "socket.io"
export default async(socket:Socket,io:Server)=> { 
        
        socket.on('joinLive',async ()=>{
            
            try{
                const questionId = socket.handshake.query.questionId as string
               
                const sockets = await io.in(`question${questionId}`).fetchSockets();
                if(sockets.length > 1) io.in(`question${questionId}`).emit('online')
            }
            catch(error){
                console.log(error)
            }
           
    })
}