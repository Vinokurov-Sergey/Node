const Article = require('../db').models.article
const newsService = require('../services/news.service')

// async function getAllNews () {
//     const result = await Article.findAll()

//     const _result = result.map(function (news) {
//       const user = JSON.parse(news.dataValues.user)
//       const data = {
//         id: news.dataValues.id,
//         created_at: news.dataValues.createdAt,
//         text: news.dataValues.text,
//         title: news.dataValues.title,
//         user: {
//             firstName: user.firstName,
//             id: user.id,
//             image: user.image,
//             middleName: user.middleName,
//             surName: user.surName,
//             username: user.userName
//         }
//       }
//       return data
//       })

//       return _result
// }

module.exports.news = async (req, res) => {
    try {
        // const result = await Article.findAll()

        // const _result = result.map(function (news) {
        //   const user = JSON.parse(news.dataValues.user)
        //   const data = {
        //     id: news.dataValues.id,
        //     created_at: news.dataValues.createdAt,
        //     text: news.dataValues.text,
        //     title: news.dataValues.title,
        //     user: {
        //         firstName: user.firstName,
        //         id: user.id,
        //         image: user.image,
        //         middleName: user.middleName,
        //         surName: user.surName,
        //         username: user.userName
        //     }
        //   }
        //   return data
        //   })
        const result = await newsService.getAllNews()
        res.json(result)
    } catch (err) {
        console.error(err)
        res.json({result: false, err})
    }
}

module.exports.createNews = async (req, res) => {
    try {
        const {title, text} = req.body
        const user = req.user
       // console.log('createNews req = ', req)
      //  console.log('createNews req.user = ', req.user)
      //  console.log('createNews user = ', user)
      //  console.log('createNews user.dataValues = ', user.dataValues)
        const data = {
            title,
            text,
            user: {
                firstName: user.dataValues.firstName,
                id: user.dataValues.id,
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
        console.log('updateNews')
        const {id} = req.params
        const {title, text} = req.body
        
        const data = {
            title,
            text
        }

        await Article.update(data, {where: {id}})
        const result = await newsService.getAllNews()
        res.json(result)
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