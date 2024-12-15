import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { users as usersCollection } from '../config/mongoCollections.js'
import validations from '../validations.js'
const saltRounds = 16

const exportedMethods = {
  async signInUser (email, password) {
    email = validations.checkEmail(email, 'Email')
    if (!email) {
      throw new Error('you must provide an email')
    }
    email = email.trim().toLowerCase()

    password = validations.checkPassword(password)

    email = email.trim()
    password = password.trim()

    try {
      let userCollection = await usersCollection()
      const user = await userCollection.findOne({ email: email })

      if (!user) {
        throw new Error('Either the email or the password is invalid')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (isPasswordValid) {
        //console.log('The passwords match.. this is good')

        const returnObj = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          favoriteQuote: user.favoriteQuote,
          themePreference: user.themePreference
        }

        return returnObj
      } else {
        console.log(
          'The passwords do not match, this is not good, they should match'
        )
        throw new Error('Either the email or the password is invalid')
      }
    } catch (error) {
      console.error(error.message)
      throw error
    }
  },

  async createUser (
    firstName,
    lastName,
    email,
    passwordPlainText,
    phoneNumber,
    bio
  ) {
    firstName = validations.checkString(firstName, 'First name')
    lastName = validations.checkString(lastName, 'Last name')
    email = validations.checkEmail(email, 'Email')
    passwordPlainText = validations.checkPassword(passwordPlainText, 'Password')
    phoneNumber = validations.checkPhoneNumber(phoneNumber);
    let password = await bcrypt.hash(passwordPlainText, saltRounds)

    let userCollection = await usersCollection()
    const existingUser = await userCollection.findOne({ email: email })
    if (existingUser) {
      throw new Error('This email already exists in our system')
    }
    let newUser = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      bio
    }
    let insertResult = await userCollection.insertOne(newUser)
    if (!insertResult.insertedId) {
      throw new Error('Error: Could not create the user')
    }
    return newUser
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
    return user
  },

  async getUserByEmail (email) {
    email = validations.checkEmail(email, 'Email')
    let userCollection = await usersCollection()
    let user = await userCollection.findOne({ email: email })
    if (!user) {
      throw new Error('Error: User not found')
    }
    return user
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

  async updateUserPut (
    id,
    firstName,
    lastName,
    email,
    passwordPlainText,
    phoneNumber,
    bio
  ) {
    id = validations.checkId(id, 'ID')
    firstName = validations.checkString(firstName, 'First name')
    lastName = validations.checkString(lastName, 'Last name')
    email = validations.checkEmail(email, 'Email')
    passwordPlainText = validations.checkPassword(passwordPlainText, 'Password')
    let password = await bcrypt.hash(passwordPlainText, saltRounds)

    let userCollection = await usersCollection()
    let existingUser = await getUserById(id.toString())

    if (!existingUser) {
      throw new Error('Error: User not found')
    }

    let updatedUserData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      bio
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
    if (userInfo.firstName) {
      userInfo.firstName = validations.checkString(
        userInfo.firstName,
        'First Name'
      )
    }

    if (userInfo.lastName) {
      userInfo.lastName = validations.checkString(
        userInfo.lastName,
        'Last Name'
      )
    }

    if (userInfo.email) {
      userInfo.email = validations.checkEmail(userInfo.email, 'Email')
    }

    if (userInfo.newPassword) {
      let passwordPlainText = validations.checkPassword(
        userInfo.newPassword,
        'Password'
      )
      userInfo.password = await bcrypt.hash(passwordPlainText, saltRounds)
    }
    delete userInfo.newPassword;
    delete userInfo.confirmPassword;

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
