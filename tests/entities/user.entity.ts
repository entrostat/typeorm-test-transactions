import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'user_id',
    })
    userId: number;

    @Column({
        type: 'varchar',
        name: 'email',
        length: 128,
    })
    email: string;
}
