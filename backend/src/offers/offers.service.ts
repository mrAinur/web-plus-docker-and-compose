import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(Wish)
		private readonly wishRepository: Repository<Wish>,
		@InjectRepository(Offer)
		private readonly offerRepository: Repository<Offer>
	) {}

	async createOffer(createOfferDto: CreateOfferDto, user: User) {
		const wish = await this.wishRepository.findOne({
			where: { id: +createOfferDto.itemId },
			relations: { owner: true }
		});
		if (wish.owner.id === user.id) {
			throw new BadRequestException({
				description: 'Вы не можете скидываться на подарок себе'
			});
		} else if (
			Number(wish.raised) + Number(createOfferDto.amount) >
			Number(wish.price)
		) {
			throw new BadRequestException({
				description:
					'Вы не можете скидывать сумму, которая при добавлении к текущей собранной сумме превысит стоимость подарка'
			});
		}
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			wish.raised = Number(createOfferDto.amount) + Number(wish.raised);
			this.wishRepository.save(wish);
			const offer = await this.offerRepository.create({
				user,
				item: wish,
				amount: createOfferDto.amount,
				hidden: createOfferDto.hidden,
				name: user.username
			});
			const resultOffer = await this.offerRepository.save(offer);
			await queryRunner.commitTransaction();
			return resultOffer;
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}
}
