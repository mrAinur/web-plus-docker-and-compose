import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import * as winston from 'winston';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';

@Module({
	imports: [
		WinstonModule.forRoot({
			levels: {
				critical_error: 0,
				error: 1,
				special_warning: 2,
				another_log_level: 3,
				info: 4
			},
			transports: [
				new winston.transports.Console({ format: winston.format.simple() }),
				new winston.transports.File({ filename: 'error.log', level: 'error' })
			]
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: '127.0.0.1',
			port: 5432,
			username: 'student',
			password: 'student',
			database: 'nest_project',
			entities: [User, Wish, Wishlist, Offer],
			synchronize: true
		}),
		ConfigModule.forRoot(),
		UsersModule,
		WishesModule,
		WishlistsModule,
		OffersModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
