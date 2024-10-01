import "dotenv/config"
import Server from "./config/express";
(async()=>{
   Server.core()
})()