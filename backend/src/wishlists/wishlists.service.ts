import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Wishlist)
		private wishlistRepository: Repository<Wishlist>
	) {}

	async createWishlist(createWishlistDto: CreateWishlistDto, id: number) {
		const user = await this.usersRepository.findOne({
			where: { id },
			relations: { wishes: true, wishlists: true }
		});
		const wishes = createWishlistDto.itemsId.map(itemId =>
			user.wishes.find(item => item.id === itemId)
		);
		const wishlist = await this.wishlistRepository.create({
			name: createWishlistDto.name,
			items: wishes,
			image: createWishlistDto.image,
			owner: user
		});
		return await this.wishlistRepository.save(wishlist);
	}

	async getWishlists(id: number) {
		const wishlist = await this.usersRepository.findOne({
			where: { id },
			relations: { wishlists: true }
		});
		return wishlist.wishlists;
	}

	async getWishlist(id: number) {
		const wishlist = await this.wishlistRepository.findOne({
			where: { id },
			relations: { items: true, owner: true }
		});
		return wishlist;
	}

	async removeWishlist(id: number, userId: number) {
		const wishlist = await this.wishlistRepository.findOne({
			where: { id },
			relations: { owner: true }
		});
		if (wishlist.owner.id === userId) {
			return await this.wishlistRepository.remove(wishlist);
		}
		throw new ConflictException({
			description: 'Вы не можете удалять чужие списки подарков'
		});
	}
}
