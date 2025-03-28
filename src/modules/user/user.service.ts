import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { isHasMorePagination } from '@/src/shared/base/pagination/is-has-more'
import { PaginationArgsWithSearchTerm } from '@/src/shared/base/pagination/pagination.args'

import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto'
import { UserResponse } from './user.response'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	public async findById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	public async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	public async findAll(
		args?: PaginationArgsWithSearchTerm
	): Promise<UserResponse> {
		const searchTermQuery = args?.searchTerm
			? this.getSearchTermFilter(args?.searchTerm)
			: {}

		const users = await this.prisma.user.findMany({
			skip: +args?.skip,
			take: +args?.take,
			where: searchTermQuery
		})

		const totalCount = await this.prisma.user.count({
			where: searchTermQuery
		})

		const isHasMore = isHasMorePagination(totalCount, +args?.skip, +args.take)

		return { items: users, isHasMore }
	}

	public async create({ password, ...dto }: CreateUserDto) {
		const user = {
			...dto,
			password: await hash(password)
		}

		return this.prisma.user.create({
			data: user
		})
	}

	public async update(id: number, { password, ...data }: UpdateUserDto) {
		await this.findById(id)

		const hashedPassword = password
			? {
					password: await hash(password)
				}
			: {}

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				...data,
				...hashedPassword
			}
		})
	}

	public async delete(id: string) {
		await this.findById(+id)

		return this.prisma.user.delete({
			where: {
				id: +id
			}
		})
	}

	private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
		return {
			OR: [
				{
					email: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					country: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}
}
