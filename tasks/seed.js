// tasks/seed.js
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users.js';
import companiesData from '../data/companies.js';
import { faker } from '@faker-js/faker';
import companies from '../seed_data/Companies.json' with { type: 'json' };

const db = await dbConnection()
await db.dropDatabase()

console.log('Starting to seed database')

// Seed 10 initial users
for (let i = 0; i < 10; i++) {
  let firstName = faker.person.firstName()
  let lastName = faker.person.lastName()
  let email = faker.internet.email()
  let password = faker.internet.password()

  try {
    const user = await users.createUser(firstName, lastName, email, password)
    console.log(`Created user: ${firstName} ${lastName} (${email})`)
  } catch (e) {
    console.error(
      `Error creating user for ${firstName} ${lastName} (${email}): ${e}`
    )
  }
}

//Seed companies from Companies.json


try {
  for (const company of companies) {
    try {
      const newCompany = await companiesData.createCompanies(
        company._id,
        company.name,
        company.domain,
        company.created_ts,
        company.updated_ts,
        company.description,
        company.size,
        company.location
      );
      console.log(`Created company: ${company.name}`);
    } catch (e) {
      console.log(`Error creating company: ${company.name}: ${e}`);
    }
  }
} catch(e) {
  console.log(`Error reading companies from file: `)
}

console.log('Done seeding database');

await closeConnection();
