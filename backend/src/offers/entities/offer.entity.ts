import { IsBoolean, IsString } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Offer {
	@PrimaryGeneratedColumn()
	id: number;
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@ManyToOne(() => User, user => user.offers)
	user: User;
	@ManyToOne(() => Wish, wish => wish.offers)
	item: Wish;
	@Column('numeric', { scale: 2 })
	amount: number;
	@Column({
		default: false
	})
	@IsBoolean()
	hidden: boolean;
	@Column()
	@IsString()
	name: string;
}
