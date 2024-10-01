export interface DatabaseConfig {
    database: string | undefined;
    username: string | undefined;
    password: string;
    host: string | undefined;
    port: number; // O usa number si prefieres
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql'; // Considera usar una unión de tipos para dialect
    timezone: string | undefined;
    define: {
        underscored: boolean;
        timestamps: boolean;
        createdAt: string;
        updatedAt: string;
    };
    dialectOptions?: {
        ssl?: boolean;
    };
}

export interface ConfigDatabase {
    development: DatabaseConfig;
    production: DatabaseConfig;
}