import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(User)
		private wishlistRepository: Repository<Wishlist>
	) {}

	async create(createUserDto: CreateUserDto) {
		const password = await bcrypt.hash(createUserDto.password, 10);
		const user = await this.usersRepository.create({
			...createUserDto,
			password
		});
		try {
			return await this.usersRepository.save(user);
		} catch (err) {
			throw new ConflictException({
				description:
					'Пользователь с такой почтой или логином уже существует, пожалуйста выберите другую почту или логин'
			});
		}
	}

	async findByUsername(username: string) {
		const user = await this.usersRepository.findOneBy({ username });
		delete user.password;
		return user;
	}

	async findUserForValidatePassword(query: FindManyOptions<User>) {
		return await this.usersRepository.findOne(query);
	}

	async editUser(editUserData: UpdateUserDto, user) {
		try {
			return await this.usersRepository.save({
				...user,
				...editUserData
			});
		} catch (err) {
			throw new ConflictException({
				description:
					'Пользователь с такой почтой или логином уже существует, пожалуйста выберите другую почту или логин'
			});
		}
	}

	async getUsers(query: FindManyOptions<User>) {
		const users = await this.usersRepository.find(query);
		users.map(item => {
			delete item.password;
			return item;
		});
		return users;
	}

	async getUserWishes(query: FindManyOptions<User>) {
		const userWishes = await this.usersRepository.findOne(query);
		return userWishes.wishes;
	}
}
