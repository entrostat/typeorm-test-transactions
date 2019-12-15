import { Connection, createConnection } from 'typeorm';
import { User } from './entities/user.entity';

export async function initialiseTestDatabase() {
    return new Promise<Connection>((resolve, reject) => {
        const connectionConfig = {
            type: process.env.DB_TYPE as any,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User],
            synchronize: true,
            dropSchema: process.env.DB_INIT,
            logging: false,
        } as any;

        switch (process.env.DB_TYPE) {
            case 'mysql':
                connectionConfig.extra = {
                    insecureAuth: true,
                };
                break;
            default:
                break;
        }

        console.log(connectionConfig);
        createConnection(connectionConfig as any)
            .then(connection => {
                // here you can start to work with your entities
                if (process.env.DB_INIT) {
                    console.log(`Database initialised...`);
                }
                resolve(connection);
            })
            .catch(error => reject(error));
    });
}
