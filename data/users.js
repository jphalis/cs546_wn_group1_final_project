import { users as usersCollection } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import validations from '../validations.js'

const exportedMethods = {
  async createUser (firstName, lastName, email, password) {
    firstName = validations.checkString(firstName, 'First name')
    lastName = validations.checkString(lastName, 'Last name')
    email = validations.checkEmail(email, 'Email')
    password = validations.checkPassword(password, 'Password')

    let userCollection = await usersCollection()
    let newUser = {
      firstName,
      lastName,
      email,
      password
    }
    let insertResult = await userCollection.insertOne(newUser)
    if (!insertResult.insertedId) {
      throw new Error('Error: Could not create the user')
    }
    return { _id: insertResult.insertedId.toString(), ...newUser }
  },

  async getAllUsers () {
    let userCollection = await usersCollection()
    let allUsers = await userCollection.find({}).toArray()
    if (allUsers.length === 0) {
      throw new Error('There are no users found in the database.')
    }
    return allUsers
  },

  async getUserById (id) {
    id = validations.checkId(id, 'ID')
    let userCollection = await usersCollection()
    let user = await userCollection.findOne({ _id: new ObjectId(id) })

    if (!user) {
      throw new Error('Error: User not found')
    }
    return await this.getUserById(user.insertedId.toString())
  },

  async removeUser (id) {
    id = validations.checkId(id, 'ID')
    let userCollection = await usersCollection()
    let deletedUser = await userCollection.findOneAndDelete({
      _id: new ObjectId(id)
    })

    if (!deletedUser) {
      throw new Error('Error: User not found')
    }
    return { ...deletedUser, deleted: true }
  },

  async updateUserPut (id, firstName, lastName, email, password) {
    id = validations.checkId(id, 'ID')
    firstName = validations.checkString(firstName, 'First name')
    lastName = validations.checkString(lastName, 'Last name')
    email = validations.checkEmail(email, 'Email')
    password = validations.checkPassword(password, 'Password')

    let userCollection = await usersCollection()
    let existingUser = await getUserById(id.toString())

    if (!existingUser) {
      throw new Error('Error: User not found')
    }

    let updatedUserData = {
      firstName,
      lastName,
      email,
      password
    }

    let updateResult = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedUserData },
      { returnDocument: 'after' }
    )

    if (!updateResult) {
      throw new Error('Error: Could not update the user')
    }
    return await updateResult
  },

  async updateUserPatch (id, userInfo) {
    id = validations.checkId(id, 'ID')
    if (userInfo.firstName)
      userInfo.firstName = validations.checkString(
        userInfo.firstName,
        'First Name'
      )

    if (userInfo.lastName)
      userInfo.lastName = validations.checkString(
        userInfo.lastName,
        'Last Name'
      )
    const userCollection = await usersCollection()
    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: userInfo },
      { returnDocument: 'after' }
    )
    if (!updateInfo) {
      throw new Error(
        `Error: Update failed, could not find a user with id of ${id}`
      )
    }
    return updateInfo
  }
}

export default exportedMethods
