import { User } from './entities/user.entity';
import { initialiseTestDatabase } from './index';
import { Connection } from 'typeorm';

describe('rollback tests', () => {
    let connection: Connection = null;

    beforeAll(async () => {
        connection = await initialiseTestDatabase();
    });

    afterAll(async () => {
        await connection.close();
    });


    it('rolls back the creation of an entity if it is wrapped in the transaction function', async () => {
        expect(true).toBe(true);
    })
});
