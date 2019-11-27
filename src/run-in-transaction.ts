import { Transactional } from 'typeorm-transactional-cls-hooked';
import { RollbackError } from './exception/RollbackError';

export type RunFunction = () => Promise<void> | void;

export function runInTransaction(func: RunFunction) {
    return async () => {
        try {
            await TransactionCreator.run(func);
        } catch (e) {
            if(e instanceof RollbackError) {
                // Do nothing here, the transaction has now been rolled back.
            } else {
                throw e;
            }
        }
    };
}

class TransactionCreator {
    @Transactional()
    static async run(func: RunFunction) {
        try {
            await func();
        } catch(e) {
            throw e;
        }
        throw new RollbackError(`This is thrown to cause a rollback on the transaction.`);
    }
}
