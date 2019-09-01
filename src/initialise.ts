import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

/**
 * Initialises the transaction context. See the reason for this at
 * https://github.com/odavid/typeorm-transactional-cls-hooked
 */
export function initialiseTestTransactions() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
}
