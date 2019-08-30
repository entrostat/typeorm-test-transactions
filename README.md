# TypeORM Test Transactions
Have you wanted to run tests on a project that uses TypeORM directly on the database and in parallel? A lot of the time we can't do this because artefacts and data from other tests can affect the result of our current tests. What usually happens, in this case, is that our tests become quite complicated when database entities are involved because we need to track exact entities. Our `count()` and other aggregations must have `where` clauses so that we don't see results from other tests that have already completed.

This library introduces a way to wrap tests in a transaction and automatically roll back the commits when the test ends. By doing this, you are able to run multiple tests concurrently and their data will not be seen by others.

You may argue that we should mock out the entities and not use a database at all. This is a valid point, but sometimes we want to test database constraints and the effects they can have on application logic.

## Credit
Before I start, I did not add much to get this to work. The major reason why this is possible is because of the work done by [odavid](https://github.com/odavid) in his [typeorm-transactional-cls-hooked](https://github.com/odavid/typeorm-transactional-cls-hooked) library. Thanks for the great work  [odavid](https://github.com/odavid)!

## Limitations
I haven't been able to test this library extensively. At the moment, I know it works for entities that extend `BaseEntity` in `TypeORM`. Over time, verifications will be done on other methods.


## Getting Started

In order to use this project you need to install the package,
```bash
npm install --save typeorm-test-transactions

# Not removing from the typeorm-transactional-cls-hooked
# dependency separation. If you don't have the below
# libraries then you'll need to install them as well

npm install --save typeorm reflect-metadata
```


To bring it into your project you'll need to import the module and initialise it before use,
```typescript
import * as TypeOrmTestTransactions from 'typeorm-test-transactions';
TypeOrmTestTransactions.initialise();
```

When running your tests (I'm using `jest` as the example), you'll want to wrap your test functions in the `runInTransaction` function.

```typescript
import { runInTransaction } from 'typeorm-test-transactions';

describe('Feature1Test', () => {

    describe('creation', () => {
        it('should allow me to create multiple users if the email address is different but name is the same', runInTransaction(async () => {
            await User.create({
                email: 'email1@test.com',
                name: 'Name'
            }).save();
            
            await User.create({
                email: 'email2@test.com',
                name: 'Name'
            }).save();
            
            expect(await User.count()).toEqual(2);
        }));
    });
});

```

## Troubleshooting

- There are some cases when the transactions don't roll back. So far, I've found the reason for that to be that the `typeorm` connection was started before this package was initialised.
