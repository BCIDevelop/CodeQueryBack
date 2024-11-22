import { Server, Socket } from "socket.io"
import axios, { Axios } from "axios";
import vm from 'vm'
import { SandBoxType } from "../types/sandbox.type";
export default async(socket:Socket,io:Server)=> { 
    socket.on('execute',async (data)=>{
        try{
            
            const questionId = socket.handshake.query.questionId as string
            socket.broadcast.in(`question${questionId}`).emit('running')
            const outputs:string[]=[]
            let {language,value} = data
            const allowedLanguages = ['python','typescript','php','sql','java','javascript']
            const limitCredits = 20
            if(!allowedLanguages.includes(language)){
                io.in(`question${questionId}`).emit('compiled',{output:"Please use an allowed Language"}) 
                return
            }
            const axiosClient = axios.create({
                baseURL: 'https://api.jdoodle.com/v1',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
           
            if(data.language === 'javascript') {
                
                const sandbox:SandBoxType = { Math, 
                    console: {
                        log: (...args) => {
                          outputs.push(args.join(' '))
                        },
                      }
                    ,Function:undefined,global:undefined,process:undefined }
                vm.createContext(sandbox) 
                new vm.Script(value)
                io.in(`question${questionId}`).emit('compiled',{output:outputs.join('\n')}) 
            }
            else{
                const responseCredits=await axiosClient.post('/credit-spent',{
                    clientId:process.env.JDOODLE_APP_ID,
                    clientSecret:process.env.JDOODLE_APP_SECRET
                })
                if(responseCredits.data.used === limitCredits) {
                    io.in(`question${questionId}`).emit('compiled',{output:"Free Limit Reached\nPleas feel free to use only JS"}) 
                    return
                }// emit some event or disconnet with a message
                if(language==='python') language = "python3"
                const response=await axiosClient.post('/execute',{
                    script: value,  
                    language,
                    versionIndex: "0",
                    clientId:process.env.JDOODLE_APP_ID,
                    clientSecret:process.env.JDOODLE_APP_SECRET
                })
                
                io.in(`question${questionId}`).emit('compiled',response.data) 
            }
            
        }
        catch(error){
            console.log('error',error)
        }
        
    })
}