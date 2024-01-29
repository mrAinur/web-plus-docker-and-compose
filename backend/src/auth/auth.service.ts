import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
	) {}

	auth(user: User) {
		const payload = { sub: Number(user.id) };
		return { access_token: this.jwtService.sign(payload) };
	}

	async validatePassword(username: string, password: string) {
		const user = await this.usersService.findUserForValidatePassword({
			where: { username }
		});
		if (!(await bcrypt.compare(password, user.password)) || !user) {
			throw new UnauthorizedException({
				description: 'Неверный логин или пароль'
			});
		}
		delete user.password;
		return user;
	}
}
