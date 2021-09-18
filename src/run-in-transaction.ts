import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { RollbackErrorException } from './exceptions/rollback-error-exception';
import { createNamespace } from 'cls-hooked';

export type RunFunction = () => Promise<void> | void;
const scope = createNamespace('recursiveContext');

/**
 * Runs the code in a transaction and runs rollback on the transaction at the
 * end of it.
 * @param func The function you want run in a transaction
 */
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

/**
 * Runs a function in a nested transaction for each connection specified
 * @param connections The connections to run the transactions in
 * @param func The function you want run in a transaction
 *
 * Thanks @Dzeri96 for this contribution
 * https://github.com/Dzeri96/typeorm-test-transactions/tree/nested-transactions
 */
export function runInMultiConnectionTransaction(
    connections: string[],
    func: RunFunction,
) {
    return async () => {
        if (connections && connections.length != 0) {
            await scope.runPromise(async () => {
                scope.set('connections', connections);
                try {
                    await TransactionCreator.runWithMultipleConnections(func);
                } catch (e) {
                    if (e instanceof RollbackErrorException) {
                        // Do nothing here, the transaction has now been rolled back.
                    } else {
                        throw e;
                    }
                }
            });
        } else {
            throw 'Connection array is empty. Consider using runInTransaction() instead.';
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

    @Transactional({
        connectionName: () => scope.get('connections').pop(),
        propagation: Propagation.NESTED,
    })
    static async runWithConnection(func: RunFunction) {
        await func();
        // Once the function has run, we throw an exception to ensure that the
        // transaction rolls back.
        throw new RollbackErrorException(
            `This is thrown to cause a rollback on the transaction.`,
        );
    }

    static async runWithMultipleConnections(func: RunFunction) {
        const connections: string[] = scope.get('connections') || [];
        if (connections.length != 0) {
            await TransactionCreator.runWithConnection(
                async () =>
                    await TransactionCreator.runWithMultipleConnections(func),
            );
        } else {
            await TransactionCreator.runWithConnection(func);
        }
    }
}
