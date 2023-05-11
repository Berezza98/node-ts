import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import ILogger from '../logger/logger.interface';

@injectable()
export default class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		await this.client.$connect();
		this.logger.log('Successfully connected to DB');
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
