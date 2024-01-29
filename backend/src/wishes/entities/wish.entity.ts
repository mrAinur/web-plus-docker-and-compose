import { IsInt, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
	@PrimaryGeneratedColumn()
	id: number;
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@Column({
		type: 'varchar',
		length: 250
	})
	@IsNotEmpty()
	@Length(1, 250, { message: 'Строка должна включать от 1 до 250 символов' })
	@IsString()
	name: string;
	@Column({
		type: 'varchar'
	})
	@IsUrl()
	@IsNotEmpty()
	link: string;
	@Column({
		type: 'varchar'
	})
	@IsNotEmpty()
	@IsUrl()
	image: string;
	@Column('numeric', { scale: 2 })
	@IsNotEmpty()
	price: number;
	@Column('numeric', { scale: 2, nullable: true, default: 0 })
	raised: number;
	@ManyToOne(() => User, user => user.wishes)
	owner: User;
	@Column({
		type: 'varchar',
		length: 1024
	})
	@IsNotEmpty()
	@Length(1, 1024, { message: 'Строка должна включать от 1 до 1024 символов' })
	@IsString()
	description: string;
	@OneToMany(() => Offer, offer => offer.item)
	offers: Offer[];
	@Column('int', { nullable: true, default: 0 })
	@IsInt()
	copied: number;
	@ManyToMany(() => Wishlist, wishlist => wishlist.items)
	wishlists: Wishlist[];
}
