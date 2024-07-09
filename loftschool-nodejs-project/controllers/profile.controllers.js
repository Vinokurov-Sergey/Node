const User = require('../db').models.user

module.exports.profile = async (req, res) => {
    try {
        const user = req.user
        const _user = await User.findOne({where: {id: user.id}})

        const data = {
            id: _user.id,
            username: _user.userName,
            firstName: _user.firstName,
            surName: _user.surName,
            middleName: _user.middleName,
            image: _user.image,
            permission: _user.permission
        }
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:'Ошибка'})
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const user = req.user
        const id = user.dataValues.id
        const oldPass = req.body.oldPassword

       console.log("updateProfile req.body = ", req.body)
        console.log("updateProfile req.payload = ", req.payload)
        console.log("updateProfile req.params = ", req.params)

        const _user = await User.findOne({where: {id}})
        console.log("updateProfile oldPass = ", oldPass)
        console.log("updateProfile _user.dataValues.password = ", _user.dataValues.password)
        if (_user.dataValues.password === oldPass) {
            const data = {
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    surName: req.body.surName,
                    oldPassword: oldPass,
                    newPassword: req.body.newPassword,
                    avatar: req.body.image
            }
            await User.update(data, {where: {id}})
            res.json(data)
        } else {
            res.json({result: false, data: 'Пароли не совпадают'})
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Ошибка'})
    }
}