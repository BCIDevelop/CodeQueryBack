import express, { Express } from 'express';
import cors from 'cors';
import fileUpload from "express-fileupload";
import routes from '../routers'
import {errors} from 'celebrate'
import morgan from "morgan";
import SocketIO from './socketio';
import { createServer } from 'http';
import passport from 'passport'


import http from "http";
class Server {
    public app: Express
    private port: string | undefined
    private server:http.Server

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server=createServer(this.app)
    }

    middleware(): void {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
        this.app.use(cors({  origin: 'http://localhost:5173' ,credentials: true}))
        this.app.use(fileUpload({debug:true}))
    }
    routers(){
        routes(this.app)
        this.app.use(errors())
    }

    listen(): void {
        this.server.listen(this.port, () => {
            console.log(`Express running on ${this.port}`)
        });
    }

    core(): void {
        this.middleware()
        this.routers()
        this.listen()
        this.socketioInit()
    }
    socketioInit(){
        const socket=new SocketIO(this.server)
        socket.init()
    }
    passportConfig():void{
        
    }
}

export default new Server()