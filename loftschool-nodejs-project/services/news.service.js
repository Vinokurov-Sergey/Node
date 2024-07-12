const Article = require('../db').models.article

module.exports.getAllNews = async () => {
    const result = await Article.findAll()

    const _result = result.map(function (news) {
      const user = JSON.parse(news.dataValues.user)
      const data = {
        id: news.dataValues.id.toString(),
        created_at: news.dataValues.createdAt,
        text: news.dataValues.text,
        title: news.dataValues.title,
        user: {
            firstName: user.firstName,
            id: user.id.toString(),
            image: user.image,
            middleName: user.middleName,
            surName: user.surName,
            username: user.userName
        }
      }
      return data
      })

     return _result
}