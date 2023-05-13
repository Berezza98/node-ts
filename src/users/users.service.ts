import { inject, injectable } from 'inversify';
import IUsersService from './users.service.interface';
import UserRegisterDto from './dto/user-register.dto';
import User from './user.entity';
import UserLoginDto from './dto/user-login.dto';
import { TYPES } from '../types';
import IConfigService from '../config/config.service.interface';
import IUsersRepository from './users.repository.interface';
import { UserModel } from '@prisma/client';
import ILogger from '../logger/logger.interface';

@injectable()
export default class UserService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(this.configService.get('SALT')));

		const existedUser = await this.usersRepository.find(email);

		if (existedUser) return null;

		return await this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) return false;

		const user = new User(existedUser.email, existedUser.name, existedUser.password);

		return await user.comparePasswords(password);
	}
}
