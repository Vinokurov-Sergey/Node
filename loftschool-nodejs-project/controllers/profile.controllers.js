const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
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

module.exports.updateProfile = async (req, res, next) => {
    try {
        const form = new formidable.IncomingForm()
        const photoDir = path.join('uploads')
         form.uploadDir = path.join(process.cwd(), photoDir)

        form.parse(req, async function(err, fields, files, dir) {
            if (err) {
              return next(err)
            }
            if (Object.keys(files).length !== 0) {
              const fileName = path.join(photoDir, files.avatar[0].originalFilename)
              fs.rename(files.avatar[0].filepath, fileName, function(err) {
                if (err) {
                  console.log(err.message)
                  return false
                }
              })
              dir = fileName.split('\\')[1]
            }

           const id = req.user.dataValues.id
            const user = await User.findOne({where: {id}})
            if (user.dataValues.password === fields.oldPassword[0]) {
                const data = {
                        id: id,
                        username: user.userName,
                        firstName: fields.firstName[0],
                        middleName: fields.middleName[0],
                        surName: fields.surName[0],
                        password: fields.newPassword[0],
                        permission: user.permission,
                        image: dir ?? user.image
                }
                await User.update(data, {where: {id}})
                res.json(data)
            } else {
                res.json({result: false, data: 'Пароли не совпадают'})
            }
    })
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Ошибка'})
    }
}