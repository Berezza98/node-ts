import { inject, injectable } from 'inversify';
import IUsersService from './users.service.interface';
import UserRegisterDto from './dto/user-register.dto';
import User from './user.entity';
import UserLoginDto from './dto/user-login.dto';
import { TYPES } from '../types';
import IConfigService from '../config/config.service.interface';

@injectable()
export default class UserService implements IUsersService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(this.configService.get('SALT')));

		return newUser;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
