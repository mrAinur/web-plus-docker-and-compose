import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
	constructor(private readonly wishlistsService: WishlistsService) {}

	@UseGuards(JwtGuard)
	@Get()
	getWishlists(@Req() req) {
		return this.wishlistsService.getWishlists(req.user.id);
	}

	@UseGuards(JwtGuard)
	@Post()
	createWishlist(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
		return this.wishlistsService.createWishlist(createWishlistDto, req.user.id);
	}

	@UseGuards(JwtGuard)
	@Get(':id')
	getWishlist(@Param() userQuery: { id: string }) {
		return this.wishlistsService.getWishlist(+userQuery.id);
	}

	@UseGuards(JwtGuard)
	@Delete(':id')
	removeWishlist(@Param() userQuery: { id: string }, @Req() req) {
		return this.wishlistsService.removeWishlist(+userQuery.id, +req.user.id);
	}
}
