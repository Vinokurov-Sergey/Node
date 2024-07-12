 const KoaRouter = require('koa-router')
 const koaBody = require('koa-body').default
 const fs = require('fs')
const path = require('path')
const db = require('../db')()
const nodemailer = require('nodemailer')
const util = require('util')
const rename = util.promisify(fs.rename)

 const router = new KoaRouter()

 const isAdmin = (ctx, next) => {
    if (ctx.session.isAdmin) {
        return next();
    }
    ctx.redirect('/login');
}

 let updatedSkills = false

router.get('/', async ctx => {
  const products = db.get('products')
  const skills = db.get('skills')
  await ctx.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', koaBody(), async ctx => {
    if (!ctx.request.body.name || !ctx.request.body.email || !ctx.request.body.message) {
        const products = db.get('products')
        const skills = db.get('skills')
        await ctx.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Нужно заполнить все поля'})
       }
       const account = await nodemailer.createTestAccount()
       const mailOptions = {
         from: `${ctx.request.body.name} <${ctx.request.body.email}>`,
         to: account.user,
         subject: 'Mail from koa web-site',
       text: `${ctx.request.body.message.trim().slice(0, 400)} \n Отправлено с: <${
        ctx.request.body.email
       }>`
       }
       const transporter = nodemailer.createTransport({
         host: 'smtp.ethereal.email',
         port: 587,
         secure: false,
         auth: {
           user: 'evelyn5@ethereal.email',
           pass: 'fffE9MwtCFsbqtDjkM'
       }
       })
       try {
        const result = await transporter.sendMail(mailOptions)
        
        if (result) {
         const products = db.get('products')
         const skills = db.get('skills')
         await ctx.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Сообщение успешно отправлено'})
        }
       } catch (error) {
        console.log(error)
        const products = db.get('products')
        const skills = db.get('skills')
        await ctx.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Ошибка отправки сообщения'})
       }
})

router.get('/login', async ctx => {
    await ctx.render('pages/login', { title: 'SigIn page' })
  })
  
  router.post('/login', koaBody(), async ctx => {
    if (ctx.request.body.email === 'aaa@mail.ru' && ctx.request.body.password === '1234') {
      ctx.session.isAdmin = true
      ctx.redirect('/admin')
    } else {
      await ctx.render('pages/login', {
        msglogin: 'Неправильный логин или пароль'
      })
    }
  })

  router.get('/admin', async ctx => {
    console.log('GET')
    if (!ctx.session.isAdmin) {
      ctx.redirect('/login')
    }
    const dbskills = db.get('skills')
    const skills = {
      age: dbskills[0].number,
      concerts: dbskills[1].number,
      cities: dbskills[2].number,
      years: dbskills[3].number,
    }

    let msgskill = undefined
    if (updatedSkills === true) {
     msgskill = 'Данные обновлены'
    updatedSkills = false
    }
     await ctx.render('pages/admin', { title: 'Admin page', skills, msgskill: msgskill })
  })
  
  router.post('/admin/skills', koaBody(), async ctx => {
    console.log('POST')
    const reqSkills = Object.values(ctx.request.body)
    const skills = db.get('skills')
  
    let index = 0
    const newSkills = skills.map((skill) => {
      skill.number = Number(reqSkills[index])
      index++
      return skill
    })
  
     db.set('skills', newSkills)
     db.save()
     
    updatedSkills = true
    ctx.redirect('/admin')
  })
  
  router.post('/admin/upload', koaBody({multipart: true}), async ctx => {
    const photoDir = path.join('./public', 'uploads')
    const upload = path.join(process.cwd(), photoDir)

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
      }
      const fileName = path.join(photoDir, ctx.request.files.photo.originalFilename)
    const uploadError = await rename(ctx.request.files.photo.filepath, fileName)
    if (uploadError) {
        return (ctx.body = {
            mes: 'Ошибка при загрузке файла',
            status: 'Error'
        })
    }

      const dir = fileName.substring(fileName.indexOf('\\'))
      const products = db.get('products')
      db.set('products', [...products, {src: dir, name: ctx.request.body.name, price: Number(ctx.request.body.price)}])
      db.save()
      ctx.redirect('/admin')
    })

 module.exports = router
