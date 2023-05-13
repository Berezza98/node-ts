import { IsEmail, IsString } from 'class-validator';

export default class UserLoginDto {
	@IsEmail({}, { message: 'Email type is not correct' })
	email: string;

	@IsString({ message: 'Password type is not correct' })
	password: string;
}
