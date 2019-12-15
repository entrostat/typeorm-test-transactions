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
        type: 'text',
        name: 'email',
    })
    email: string;
}
