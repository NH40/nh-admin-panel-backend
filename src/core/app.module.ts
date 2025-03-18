import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '../modules/auth/auth.module'
import { SettingsModule } from '../modules/settings/settings.module'
import { StatisticsModule } from '../modules/statistics/statistics.module'
import { UserModule } from '../modules/user/user.module'

import { PrismaModule } from './prisma/prisma.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		PrismaModule,
		AuthModule,
		UserModule,
		SettingsModule,
		StatisticsModule
	]
})
export class AppModule {}
