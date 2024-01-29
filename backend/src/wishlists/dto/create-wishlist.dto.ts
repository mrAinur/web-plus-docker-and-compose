import { IsArray, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
	@IsNotEmpty()
	@Length(1, 250, { message: 'Строка должна включать от 1 до 250 символов' })
	@IsString()
	name: string;
	@IsUrl()
	@IsNotEmpty()
	image: string;
	@IsNotEmpty()
	@IsArray()
	itemsId: number[];
}
