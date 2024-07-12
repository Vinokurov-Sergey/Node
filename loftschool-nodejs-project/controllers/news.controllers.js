const Article = require('../db').models.article
const newsService = require('../services/news.service')

module.exports.news = async (req, res) => {
    try {
        const result = await newsService.getAllNews()

        return res.json(result)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.createNews = async (req, res) => {
    try {
        const {title, text} = req.body
        const user = req.user

        const data = {
            title,
            text,
            user: {
                firstName: user.dataValues.firstName,
                id: user.dataValues.id.toString(),
                image: user.dataValues.image,
                middleName: user.dataValues.middleName,
                surName: user.dataValues.surName,
                userName: user.dataValues.userName,
            }
        }

        await Article.create(data)
        const result = await newsService.getAllNews()
        res.json(result)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.updateNews = async (req, res) => {
    try {
        const {id} = req.params
        const {title, text, created_at} = req.body
        const user = req.user

        const data = {
            id: id.toString(),
            created_at,
            title,
            text,
            user: {
                firstName: user.dataValues.firstName,
                id: user.dataValues.id.toString(),
                image: user.dataValues.image,
                middleName: user.dataValues.middleName,
                surName: user.dataValues.surName,
                userName: user.dataValues.userName,
            }
        }

        await Article.update(data, {where: {id}})
        const result = await newsService.getAllNews()
        return res.json(result)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.deleteNews = async (req, res) => {
    try {
        const {id} = req.params

        await Article.destroy({where: {id}})
        const _result = await newsService.getAllNews()
        res.json(_result)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}