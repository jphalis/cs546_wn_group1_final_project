import { Router } from 'express'
import { usersData } from '../../DataAccess/data/index.js'
import validations from '../validations.js'
let router = Router()

router
  .route('/')
  .get(async (req, res) => {
    try {
      const userList = await usersData.getAllUsers()
      res.render('users/index', { users: userList })
    } catch (e) {
      return res.status(500).send(e)
    }
  })
  .post(async (req, res) => {
    let userInfo = req.body
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }

    try {
      userInfo.firstName = validations.checkString(
        userInfo.firstName,
        'First Name'
      )
      userInfo.lastName = validations.checkString(
        userInfo.lastName,
        'Last Name'
      )
      userInfo.email = validations.checkEmail(userInfo.email, 'Email')
      userInfo.password = validations.checkPassword(
        userInfo.password,
        'Password'
      )
    } catch (e) {
      return res.status(400).json({ error: e })
    }

    try {
      const newUser = await usersData.createUser(
        userInfo.firstName,
        userInfo.lastName,
        userInfo.email,
        userInfo.password
      )
      return res.json(newUser)
    } catch (e) {
      return res.sendStatus(500)
    }
  })
  .delete(async (req, res) => {
    // Not implemented
    return res.send('DELETE request to http://localhost:3000/users')
  })
  .put(async (req, res) => {
    // Not implemented
    return res.send('PUT request to http://localhost:3000/users')
  })

router
  .route('/:userId')
  .get(async (req, res) => {
    try {
      req.params.id = validations.checkId(req.params.userId, 'User ID')
    } catch (e) {
      return res.status(400).json({ error: e })
    }
    try {
      const user = await usersData.getUserById(req.params.id)
      res.render('users/detail', {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      })
    } catch (e) {
      return res.status(404).json(e)
    }
  })
  .put(async (req, res) => {
    let requestBody = req.body
    let userId = validations.checkId(req.params.userId, 'User ID')

    if (!requestBody || Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }

    try {
      requestBody.firstName = validations.checkString(
        requestBody.firstName,
        'First Name'
      )
      requestBody.lastName = validations.checkString(
        requestBody.lastName,
        'Last Name'
      )
      requestBody.email = validations.checkEmail(requestBody.email, 'Email')
      requestBody.password = validations.checkPassword(
        requestBody.password,
        'Password'
      )
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }

    try {
      let updatedUser = await usersData.updateUserPut(
        userId,
        requestBody.firstName,
        requestBody.lastName,
        requestBody.email,
        requestBody.password
      )
      res.status(200).json(updatedUser)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  })
  .patch(async (req, res) => {
    let userInfo = req.body
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }
    try {
      req.params.id = validations.checkId(req.params.id)
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
      if (userInfo.password) {
        userInfo.password = validations.checkPassword(
          userInfo.password,
          'Password'
        )
      }
    } catch (e) {
      return res.status(400).json({ error: e })
    }

    try {
      const updatedUser = await userData.updateUserPatch(
        req.params.id,
        userInfo
      )
      return res.json(updatedUser)
    } catch (e) {
      return res.status(404).send({ error: e })
    }
  })
  .delete(async (req, res) => {
    let userId = req.params.userId

    try {
      userId = validations.checkId(userId, 'User ID')
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }

    try {
      let deletedUser = await usersData.removeUser(userId)
      res.status(200).json(deletedUser)
    } catch (e) {
      return res.status(404).json({ error: e.message })
    }
  })

router
  .route('/:userId/edit')
  .get(async (req, res) => {
    try {
      req.params.id = validations.checkId(req.params.userId, 'User ID')
    } catch (e) {
      return res.status(400).json({ error: e })
    }
    try {
      const user = await usersData.getUserById(req.params.id)
      res.render('users/edit', { user: user, partial: 'edit_user_script' })
    } catch (e) {
      return res.status(404).json(e)
    }
  })
  .post(async (req, res) => {
    console.log('here')
    let userInfo = req.body
    let errors = []
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }

    try {
      req.params.id = validations.checkId(req.params.id)
      if (userInfo.firstName) {
        userInfo.firstName = validations.checkString(
          userInfo.firstName,
          'First Name'
        )
      }
    } catch (e) {
      errors.push(e)
    }

    try {
      if (userInfo.lastName) {
        userInfo.lastName = validations.checkString(
          userInfo.lastName,
          'Last Name'
        )
      }
    } catch (e) {
      errors.push(e)
    }

    try {
      if (userInfo.email) {
        userInfo.email = validations.checkEmail(userInfo.email, 'Email')
      }
    } catch (e) {
      errors.push(e)
    }

    if (errors.length > 0) {
      const user = await usersData.getUserById(req.params.id)
      res.render('users/edit', {
        errors: errors,
        hasErrors: true,
        user: user
      })
      return
    }

    try {
      const updatedUser = await userData.updateUserPatch(
        req.params.id,
        userInfo
      )
      res.redirect(`/users/${updatedUser._id}`)
    } catch (e) {
      return res.status(404).send({ error: e })
    }
  })

export default router
