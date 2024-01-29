import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Wishlist])],
	controllers: [UsersController],
	providers: [UsersService, ConfigService],
	exports: [UsersService]
})
export class UsersModule {}
