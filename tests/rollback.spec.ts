import { User } from './entities/user.entity';
import { Connection } from 'typeorm';
import { runInTransaction, initialiseTestTransactions } from '../src';
import { initialiseTestDatabase } from './initialise-test-database';

initialiseTestTransactions();

describe('rollback tests', () => {
    let connection: Connection = null;

    beforeAll(async () => {
        connection = await initialiseTestDatabase();
    });

    afterAll(async () => {
        await connection.close();
    });

    it('rolls back the creation of an entity if it is wrapped in the transaction function', async () => {
        const email = 'sameuser@gmail.com';
        await runInTransaction(async () => {
            const user = User.create({ email });
            await user.save();
            const found = await User.findOne({
                where: { email },
            });
            expect(found).toBeDefined();
        });

        await runInTransaction(async () => {
            const user = User.create({ email });
            await user.save();
            const found = await User.findOne({
                where: { email },
            });
            expect(found).toBeDefined();
        });
    });

    it('rolls back multiple inserts', async () => {
        await runInTransaction(async () => {
            let email = 'user1@gmail.com';
            await User.create({ email }).save();
            let found = await User.findOne({
                where: { email },
            });
            expect(found).toBeDefined();

            email = 'user2@gmail.com';
            User.create({ email }).save();
            found = await User.findOne({
                where: { email },
            });
            expect(found).toBeDefined();

            expect(await User.count()).toBe(2);
        });

        await runInTransaction(async () => {
            expect(await User.count()).toBe(0);
        });
    });
});
