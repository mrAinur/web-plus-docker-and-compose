import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Wish, User, Wishlist])],
	controllers: [WishesController],
	providers: [WishesService]
})
export class WishesModule {}
