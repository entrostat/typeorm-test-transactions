import { Transactional } from 'typeorm-transactional-cls-hooked';
import { RollbackErrorException } from './exceptions/rollback-error-exception';

export type RunFunction = () => Promise<void> | void;

export function runInTransaction(func: RunFunction) {
    return async () => {
        try {
            await TransactionCreator.run(func);
        } catch (e) {
            if (e instanceof RollbackErrorException) {
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
        await func();
        // Once the function has run, we throw an exception to ensure that the
        // transaction rolls back.
        throw new RollbackErrorException(
            `This is thrown to cause a rollback on the transaction.`,
        );
    }
}
