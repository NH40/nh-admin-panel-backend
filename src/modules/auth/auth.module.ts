import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { getJwtConfig } from '@/src/core/config/jwt.config'
import { EmailService } from '@/src/core/email/email.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { JwtStrategy } from '@/src/shared/strategy/jwt.strategy'

import { UserService } from '../user/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		PrismaService,
		UserService,
		JwtStrategy,
		EmailService
	],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	]
})
export class AuthModule {}
