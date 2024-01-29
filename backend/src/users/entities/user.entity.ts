import { IsEmail, IsNotEmpty } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@Column({
		type: 'varchar',
		length: 30,
		unique: true
	})
	username: string;
	@Column({
		type: 'varchar',
		length: 200,
		default: 'Пока ничего не рассказал о себе'
	})
	about: string;
	@Column({
		type: 'varchar',
		default: 'https://i.pravatar.cc/300'
	})
	avatar: string;
	@Column({
		type: 'varchar',
		unique: true
	})
	@IsEmail()
	email: string;
	@Column({
		type: 'varchar'
	})
	@IsNotEmpty()
	password: string;
	@JoinColumn()
	@OneToMany(() => Wish, wish => wish.owner)
	wishes: Wish[];
	@JoinColumn()
	@OneToMany(() => Offer, offer => offer.user)
	offers: Offer[];
	@JoinColumn()
	@OneToMany(() => Wishlist, wishlist => wishlist.owner)
	wishlists: Wishlist[];
}
