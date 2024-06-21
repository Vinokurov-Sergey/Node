const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const db = require('../db')()

router.get('/', (req, res, next) => {
  const products = db.get('products')
  const skills = db.get('skills')
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
   const products = db.get('products')
   const skills = db.get('skills')
   res.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Нужно заполнить все поля'})
  }
  const account = await nodemailer.createTestAccount()
  const mailOptions = {
    from: `${req.body.name} <${req.body.email}>`,
    to: account.user,
    subject: 'Mail from web-site',
  text: `${req.body.message.trim().slice(0, 400)} \n Отправлено с: <${
    req.body.email
  }>`

  }
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'brennon9@ethereal.email',
      pass: 'q4TWpkC4VY6uXFaUer'
  }
  })
  transporter.sendMail(mailOptions, function (err) {
    const products = db.get('products')
   const skills = db.get('skills')
    if (err) {
      res.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Ошибка отправки сообщения'})
      console.log(err)
    } else {
   res.render('pages/index', { title: 'Main page', products, skills, msgemail: 'Сообщение отправлено успешно'})
    }
  })
})

module.exports = router
