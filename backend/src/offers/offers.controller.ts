import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('offers')
export class OffersController {
	constructor(private readonly offersService: OffersService) {}

	@UseGuards(JwtGuard)
	@Post()
	createOffer(@Body() payload: CreateOfferDto, @Req() req) {
		return this.offersService.createOffer(payload, req.user);
	}
}
