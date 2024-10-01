import { ConfigDatabase } from "../types/config.type"

const config: ConfigDatabase = {
    
    development:{
        database:process.env.DB_NAME,
        username:process.env.DB_USER,
        password:process.env.DB_PASSWORD || "",
        host:process.env.DB_HOST,
        port:Number(process.env.DB_PORT),
        dialect:process.env.DB_DRIVER as 'mysql' | 'postgres' | 'sqlite' | 'mssql',
        timezone:process.env.TZ,
        define:{
            underscored:true, 
            timestamps:true,
            createdAt:'created_at',
            updatedAt:'updated_at'

        }
    },
    production:{
        database:process.env.DB_NAME,
        username:process.env.DB_USER,
        password:process.env.DB_PASSWORD || "",
        host:process.env.DB_HOST,
        port:Number(process.env.DB_PORT),
        dialect:process.env.DB_DRIVER as 'mysql' | 'postgres' | 'sqlite' | 'mssql',
        timezone:process.env.TZ,
        define:{
            underscored:true, 
            timestamps:true,
            createdAt:'created_at',
            updatedAt:'updated_at'

        },
        dialectOptions:{
            ssl:true
        },

    }
}
export default config