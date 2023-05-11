import { IsEmail, IsString } from 'class-validator';

export default class UserRegisterDto {
	@IsEmail({}, { message: 'Email is not correct' })
	email: string;

	@IsString({ message: 'Password is not correct' })
	password: string;

	@IsString({ message: 'Name is not correct' })
	name: string;
}
