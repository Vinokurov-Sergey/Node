const passport = require('passport')
const LocalStrategy = require('passport-local')
const tokenService = require('../services/token.service')
const User = require('../db').models.user

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const userData = await User.findOne({where: {id}})
    const user = userData.dataValues
    const _user = user.id === id ? user: false
    done(null, _user)
})

passport.use(new LocalStrategy({userNameField: 'username'}, async (userName, password, done) => {
    const _user = await User.findOne({where: {userName}})
    const user = _user.dataValues

    if (userName === user.userName && password === user.password) {
        return done(null, user)
    } else {
        return done(null, false)
    }
}))

module.exports.users = async (req, res) => {
    try {
        const result = await User.findAll()

        const users = result.map(function (user) {
            const data = {
                firstName: user.dataValues.firstName,
                id: user.dataValues.id,
                image: user.dataValues.image,
                middleName: user.dataValues.middleName,
                permission: {
                    chat: { 
                        C: user.dataValues.permission.chat.C, 
                        R: user.dataValues.permission.chat.R, 
                        U: user.dataValues.permission.chat.U, 
                        D: user.dataValues.permission.chat.D },
                    news: { 
                        C: user.dataValues.permission.news.C, 
                        R: user.dataValues.permission.news.R, 
                        U: user.dataValues.permission.news.U, 
                        D: user.dataValues.permission.news.D },
                    settings: { 
                        C: user.dataValues.permission.settings.C, 
                        R: user.dataValues.permission.settings.R, 
                        U: user.dataValues.permission.settings.U, 
                        D: user.dataValues.permission.settings.D }
                },
                surName: user.dataValues.surName,
                username: user.dataValues.userName
            }
            return data
        })

       res.json(users)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.registration = async (req, res) => {
    try {
        const {username, surName, firstName, middleName, password} = req.body

        const permission = {
            chat: { C: true, R: true, U: true, D: true },
            news: { C: true, R: true, U: true, D: true },
            settings: { C: true, R: true, U: true, D: true }
        }

        const dataUser = {
            userName: username,
            surName,
            firstName,
            middleName,
            password,
            permission
        }

        const user = await User.create(dataUser)
        const tokens = tokenService.createPairTokens(user.dataValues)

        const responseUser = {
            id: user.id,
            image: user.image,
            username,
            surName,
            firstName,
            middleName,
            ...tokens,
            permission
        }
        res.json({...responseUser})
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const {username} = req.body
        const _user = await User.findOne({where: {userName: username}})
        const user = _user.dataValues
        passport.authenticate('local', (err, user) => {
            if (err) {
                return next(err)
            }
            req.login(user, () => {
                const tokens = tokenService.createPairTokens(user)
                const data = {
                    id: user.id,
                    username: user.userName,
                    firstName: user.firstName,
                    surName: user.surName,
                    middleName: user.middleName,
                    image: user.image,
                    ...tokens,
                    permission: user.permission
                }
                res.json({...data})
            })
        })(req, res, next)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.permissionUser = async (req, res) => {
    try {
        const {id} = req.params
        const {permission} = req.body
        const result = await User.update({permission}, {where: {id}})
        res.json({result: true, data: result})
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        const result = await User.destroy({where: {id}})
        res.json({result: true, data: result})
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.refreshToken = async (req, res) => {
    try {
        const tokens = tokenService.refreshTokens({user: req.user})
        res.json(tokens)
    } catch (err) {
        res.status(401).json({message: 'Пользователь не авторизован!'})
    }
}