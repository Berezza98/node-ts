import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import IConfigService from './config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import ILogger from '../logger/logger.interface';

@injectable()
export default class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Can`t read .env file');
		} else {
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
