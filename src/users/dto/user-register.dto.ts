import { IsEmail, IsString } from 'class-validator';

export default class UserRegisterDto {
	@IsEmail({}, { message: 'Email type is not correct' })
	email: string;

	@IsString({ message: 'Password type is not correct' })
	password: string;

	@IsString({ message: 'Name type is not correct' })
	name: string;
}
