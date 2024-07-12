const jwt = require('jsonwebtoken')
const config = require('../config/default.json')

function createToken (payload, expiresIn) {
    const secret = config.jwtSecret
    const token = jwt.sign(payload, secret, {expiresIn})
    const decodedToken = jwt.decode(token, secret)

    return {
        token,
        tokenExpiredAt: decodedToken.exp * 1000
    }
}

module.exports.createPairTokens = (user) => {
    const payload = {
        id: user.id,
        username: user.userName
    }
    const tokenLife = config.tokenLife
    const refreshTokenLife = config.refreshTokenLife
    const accessToken = createToken(payload, tokenLife)
    const refreshToken = createToken(payload, refreshTokenLife)

    return {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        accessTokenExpiredAt: accessToken.tokenExpiredAt,
        refreshTokenExpiredAt: refreshToken.tokenExpiredAt,
    }
}

module.exports.verifyToken = (token) => {
    try {
        const secret = config.jwtSecret
        const payload = jwt.verify(token, secret)
        return payload
    } catch (err) {
        return null
    }
}

module.exports.refreshTokens = (payload) => {
    if (payload) {
        const tokens = this.createPairTokens({user: payload.user})
        return tokens
    } else {
        return {}
    }
}