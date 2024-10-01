import express, { Express } from 'express';
import cors from 'cors';
import fileUpload from "express-fileupload";
import routes from '../routers'
import {errors} from 'celebrate'
import morgan from "morgan";
class Server {
    public app: Express
    private port: string | undefined

    constructor() {
        this.app = express()
        this.port = process.env.PORT
    }

    middleware(): void {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
        this.app.use(cors({ origin: '*' }))
        this.app.use(fileUpload({debug:true}))
    }
    routers(){
        routes(this.app)
        this.app.use(errors())
    }

    listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Express running on ${this.port}`)
        });
    }

    core(): void {
        this.middleware()
        this.routers()
        this.listen()
    }
}

export default new Server()