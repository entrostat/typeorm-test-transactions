import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { RollbackErrorException } from './exceptions/rollback-error-exception';
import { createNamespace } from 'cls-hooked';

export type RunFunction = () => Promise<void> | void;
let scope = createNamespace('recursiveContext');

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
 * Runs @param func in recursively nested transactions for each connection in @param connections,
 *  starting from right to left.
 */
export function runInTransactionConns(connections: string[], func: RunFunction){
    return async () => {
        if (connections && connections.length != 0) {
            await scope.runPromise(async () => {
                scope.set('connections', connections);
                try {
                    await TransactionCreator.runWithConns(func);
                } catch (e) {
                    if (e instanceof RollbackErrorException) {
                        // Do nothing here, the transaction has now been rolled back.
                    } else {
                        throw e;
                    }
                }
                
            });
        } else {
            throw 'Connection array is empty. Consider using runInTransaction() instead.'
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

    @Transactional({connectionName: () => scope.get('connections').pop(), propagation: Propagation.NESTED})
    static async runWithConn(func: RunFunction) {
        await func();
        // Once the function has run, we throw an exception to ensure that the
        // transaction rolls back.
        throw new RollbackErrorException(
            `This is thrown to cause a rollback on the transaction.`,
        );
    }

    static async runWithConns(func: RunFunction) {
        let connections: string[] = scope.get('connections');
        if(connections.length != 0) {
            await TransactionCreator.runWithConn(async () => await TransactionCreator.runWithConns(func));
        } else {
            await TransactionCreator.runWithConn(func);
        }
    }
}
