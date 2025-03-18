import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'

import { PaginationArgsWithSearchTerm } from '@/src/shared/base/pagination/pagination.args'
import { Auth } from '@/src/shared/decorators/auth.decorator'

import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth('ADMIN')
	@Get()
	public async getList(@Query() params: PaginationArgsWithSearchTerm) {
		return this.userService.findAll(params)
	}

	@Auth('ADMIN')
	@Get(':id')
	public async getById(@Param('id') id: string) {
		return this.userService.findById(+id)
	}

	@Auth('ADMIN')
	@Post()
	public async createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Auth('ADMIN')
	@Put(':id')
	public async updateUser(
		@Param('id') id: string,
		@Body() updateDto: UpdateUserDto
	) {
		return this.userService.update(+id, updateDto)
	}

	@Auth('ADMIN')
	@Delete(':id')
	public async deleteUser(@Param('id') id: string) {
		return this.userService.delete(id)
	}
}
