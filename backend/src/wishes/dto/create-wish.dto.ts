import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
	@IsNotEmpty()
	@Length(1, 250, { message: 'Строка должна включать от 1 до 250 символов' })
	@IsString()
	name: string;
	@IsUrl()
	@IsNotEmpty()
	link: string;
	@IsNotEmpty()
	@IsUrl()
	image: string;
	@IsNotEmpty()
	price: number;
	@IsNotEmpty()
	@Length(1, 1024, { message: 'Строка должна включать от 1 до 1024 символов' })
	@IsString()
	description: string;
}
