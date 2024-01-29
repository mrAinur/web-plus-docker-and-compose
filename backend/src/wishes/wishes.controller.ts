import {
	Controller,
	Post,
	Body,
	Delete,
	Req,
	UseGuards,
	Get,
	Param,
	Patch
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
	constructor(private readonly wishesService: WishesService) {}

	@UseGuards(JwtGuard)
	@Post()
	makeNewWish(@Body() createWishDTO: CreateWishDto, @Req() req: Request) {
		return this.wishesService.create(createWishDTO, req.user);
	}

	@UseGuards(JwtGuard)
	@Delete(':id')
	removeWish(@Param() queryParam: { id: string }, @Req() req) {
		return this.wishesService.removeWish(+queryParam.id, +req.user.id);
	}

	@Get('last')
	getLastWishes() {
		return this.wishesService.getLastWishes();
	}

	@Get('top')
	getTopWishes() {
		return this.wishesService.getTopWishes();
	}

	@UseGuards(JwtGuard)
	@Get(':id')
	getWish(@Param() queryParam: { id: string }, @Req() req) {
		return this.wishesService.getWish(+queryParam.id, req.user);
	}

	@UseGuards(JwtGuard)
	@Post(':id/copy')
	copyWish(@Param() queryParam: { id: string }, @Req() req) {
		return this.wishesService.copyWish(+queryParam.id, req.user);
	}

	@UseGuards(JwtGuard)
	@Patch(':id')
	editWish(
		@Req() req,
		@Body() updateWishDto: UpdateWishDto,
		@Param() queryParam: { id: string }
	) {
		return this.wishesService.editWish(req.user, updateWishDto, +queryParam.id);
	}
}
