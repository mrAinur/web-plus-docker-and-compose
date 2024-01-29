import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';

const { port = 3002 } = process.env;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	app.use(cookieParser());

	const config = new DocumentBuilder()
		.setTitle('Название вашего API сервиса')
		.setDescription('Назначение API сервиса (описание)')
		.setVersion('1.0')
		.build(); // завершаем конфигурирование вызовом build

	const document = SwaggerModule.createDocument(app, config);

	//   первый аргумент - путь, по которому будет доступна
	//   веб-страница с документацией Swagger
	SwaggerModule.setup('/api/docs', app, document);
	await app.listen(port);
}
bootstrap();

export enum ErrorCode {
	LoginOrPasswordIncorrect = 100,
	UserAlreadyExists = 101
}
