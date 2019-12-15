import { User } from './entities/user.entity';
import { initialiseTestDatabase } from './index';
import { Connection, QueryFailedError } from 'typeorm';

describe('entity creation', () => {
    let connection: Connection = null;

    beforeAll(async () => {
        connection = await initialiseTestDatabase();
    });

    afterAll(async () => {
        await connection.close();
    });


    it('allows for an entity to be created', async () => {
        const email = 'entitycreation@gmail.com';
        const user = User.create({ email });

        await user.save();

        const found = await User.findOne({
            where: { email }
        });

        expect(found).toBeDefined();
    });

    it('fails if you try to create two of the same entity', async () => {
        const email = 'uniqueconstraint@gmail.com';
        const user = User.create({ email });

        await user.save();

        const found = await User.findOne({
            where: { email }
        });

        expect(found).toBeDefined();

        try {
            const sameUser = User.create({ email });
            await sameUser.save();
        } catch (e) {
            expect(e instanceof QueryFailedError).toBe(true);
        }
    });
});
