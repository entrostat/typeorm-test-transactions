import { Transactional } from 'typeorm-transactional-cls-hooked';

export type RunFunction = () => Promise<void> | void;

export async function runInTransaction(func: RunFunction) {
    return async () => {
        try {
            await TransactionCreator.run(func);
        } catch (e) {
            // Do nothing here, the transaction has now been rolled back.
        }
    };
}

export async function run(func: RunFunction) {
    try {
        await TransactionCreator.run(func);
    } catch (e) {
        // Do nothing here, the transaction has now been rolled back.
    }
}

class TransactionCreator {
    @Transactional()
    static async run(func: RunFunction) {
        await func();
        throw new Error(
            `This is thrown to cause a rollback on the transaction.`,
        );
    }
}
