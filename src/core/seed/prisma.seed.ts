import { faker } from '@faker-js/faker'
import { hash } from 'argon2'

import { Prisma, PrismaClient } from '../../../prisma/generated'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable
	}
})

const countries = [
	'Russia',
	'South Korea',
	'Thailand',
	'China',
	'UK',
	'Netherlands'
]

async function main() {
	const NUM_USERS = 200

	for (let i = 0; i < NUM_USERS; i++) {
		const email = faker.internet.email()
		const name = faker.person.firstName()
		const avatarUrl = faker.image.avatar()
		const password = await hash('123456')
		const country = faker.helpers.arrayElement(countries)
		const createdAt = faker.date.past({ years: 1 })

		const updatedAt = new Date(
			createdAt.getTime() +
				Math.random() * (new Date().getTime() - createdAt.getTime())
		)

		await prisma.user.create({
			data: {
				email,
				name,
				avatarUrl,
				password,
				country,
				createdAt,
				updatedAt
			}
		})
	}
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
