// tasks/seed.js
import { dbConnection, closeConnection } from '../config/mongoConnection.js'
import users from '../data/users.js'
import { faker } from '@faker-js/faker'
import questionsData from '../seed_data/Questions.json' with { type: 'json' }
import companiesData from '../seed_data/Companies.json' with { type: 'json' }

const db = await dbConnection()
await db.dropDatabase()

console.log('Starting to seed database.')

// Import Questions.json into questions collection
const questionsCollection = await db.collection('questions')
try {
  const questionsInsertResult = await questionsCollection.insertMany(
    questionsData
  )
  console.log(`Inserted ${questionsInsertResult.insertedCount} questions.`)
} catch (e) {
  console.error(`Error inserting questions: ${e}`)
}

// Import Companies.json into companies collection
const companiesCollection = await db.collection('companies')
try {
  const companiesInsertResult = await companiesCollection.insertMany(
    companiesData
  )
  console.log(`Inserted ${companiesInsertResult.insertedCount} companies.`)
} catch (e) {
  console.error(`Error inserting companies: ${e}`)
}

// Seed 10 initial users
for (let i = 0; i < 10; i++) {
  let firstName = faker.person.firstName()
  let lastName = faker.person.lastName()
  let email = faker.internet.email()
  let password = faker.internet.password()
  let phoneNumber = faker.phone.number()
  let bio = faker.lorem.sentence()

  try {
    const user = await users.createUser(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      bio
    )
    console.log(
      `Created user: ${firstName} ${lastName} (${email}) - ${password}`
    )
  } catch (e) {
    console.error(
      `Error creating user for ${firstName} ${lastName} (${email}): ${e}`
    )
  }
}

console.log('Done seeding database.')

await closeConnection()
