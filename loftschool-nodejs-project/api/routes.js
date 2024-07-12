const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controllers')
const NewsController = require('../controllers/news.controllers')
const ProfileController = require('../controllers/profile.controllers')
const TokenMiddleware = require('../middleware/auth.middleware')

router.get('/users/', TokenMiddleware.authentication, UserController.users)
router.post('/registration/', UserController.registration)
router.post('/login/', UserController.login)
router.post('/refresh-token/', TokenMiddleware.authentication, UserController.refreshToken)
router.patch('/users/:id/permission', TokenMiddleware.authentication, UserController.permissionUser)
router.delete('/users/:id', TokenMiddleware.authentication, UserController.deleteUser)

router.get('/profile/', TokenMiddleware.authentication, ProfileController.profile)
router.patch('/profile/', TokenMiddleware.authentication, ProfileController.updateProfile)

router.get('/news/', TokenMiddleware.authentication, NewsController.news)
router.post('/news/', TokenMiddleware.authentication, NewsController.createNews)
router.patch('/news/:id', TokenMiddleware.authentication, NewsController.updateNews)
router.delete('/news/:id', TokenMiddleware.authentication, NewsController.deleteNews)

module.exports = router