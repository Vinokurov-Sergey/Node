const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  if (req.session.isAdmin) {
    res.redirect('/admin')
  }
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  if (req.body.email === 'aaa@mail.ru' && req.body.password === '1234') {
    req.session.isAdmin = true
    res.redirect('/admin')
  } else {
    res.render('pages/login', {
      msglogin: 'Неправильный логин или пароль'
    })
  }
})

module.exports = router
