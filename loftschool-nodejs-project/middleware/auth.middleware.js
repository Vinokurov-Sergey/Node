const tokenService = require('../services/token.service')
const User = require('../db').models.user

module.exports.authentication = async (req, res, next) => {
    const token = req.headers['authorization'] ?? null
    const payload = tokenService.verifyToken(token)

    if (payload) {
        const user = await User.findOne({where : { userName: payload.username }})
        req.user = user
        next()
    } else {
        res.status(401).json({message: 'Пользователь не авторизован!'})
    }
}