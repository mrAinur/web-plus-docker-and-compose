import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
	constructor(
		@InjectRepository(Wish)
		private wishRepository: Repository<Wish>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(User)
		private wishlistRepository: Repository<Wishlist>
	) {}
	async create(createWishDto: CreateWishDto, userInfo) {
		const user = await this.usersRepository.findOne({
			where: { id: userInfo.id },
			relations: { wishes: true, wishlists: true }
		});
		const wish = await this.wishRepository.create({
			...createWishDto,
			owner: user
		});
		user.wishes.push(wish);
		await this.usersRepository.save(user);
		return await this.wishRepository.save(wish);
	}

	async getWish(id: number, user: User) {
		const userWish = await this.wishRepository.findOne({
			where: { id },
			relations: { owner: true, offers: true }
		});
		if (userWish.owner.id !== user.id)
			userWish.offers = userWish.offers.filter(item => !item.hidden);
		return userWish;
	}

	async removeWish(id: number, userId: number) {
		const wish = await this.wishRepository.findOne({
			where: { id },
			relations: { owner: true }
		});
		if (wish.owner.id === userId) return await this.wishRepository.remove(wish);
		throw new ConflictException({
			description: 'Вы не можете удалять чужие подарки'
		});
	}

	async getLastWishes() {
		return this.wishRepository.find({ order: { createdAt: 'DESC' }, take: 40 });
	}

	async getTopWishes() {
		return this.wishRepository.find({ order: { copied: 'DESC' }, take: 20 });
	}

	async copyWish(id: number, user: User) {
		const copyWish = await this.wishRepository.findOne({ where: { id } });
		const userWishes = await this.usersRepository.findOne({
			where: { id: user.id },
			relations: { wishes: true }
		});
		const checkCopyWish = userWishes.wishes.find(item => {
			if (
				item.name === copyWish.name &&
				item.price === copyWish.price &&
				item.link === copyWish.link &&
				item.image === copyWish.image
			)
				return item;
		});
		if (checkCopyWish) {
			throw new BadRequestException({
				description: 'Вы уже копировали себе этот подарок'
			});
		}
		copyWish.copied++;
		const newWish = await this.wishRepository.create({
			name: copyWish.name,
			link: copyWish.link,
			image: copyWish.image,
			price: copyWish.price,
			description: copyWish.description,
			owner: user,
			raised: 0
		});
		await this.wishRepository.save(copyWish);
		return await this.wishRepository.save(newWish);
	}

	async editWish(user: User, updateWishDto: UpdateWishDto, id: number) {
		const wish = await this.wishRepository.findOne({
			where: { id },
			relations: { owner: true }
		});
		if (user.id !== wish.owner.id) {
			throw new BadRequestException({
				description: 'Вы можете редактировать только свои подарки'
			});
		} else if (Number(wish.raised) !== 0) {
			throw new BadRequestException({
				description:
					'Вы не можете редактировать подарки, на которые уже скинулись пользователи'
			});
		}

		return await this.wishRepository.save({ ...wish, ...updateWishDto });
	}
}
