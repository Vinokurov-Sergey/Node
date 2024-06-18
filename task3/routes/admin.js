const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const db = require('../db')()

router.get('/', (req, res, next) => {
  if (!req.session.isAdmin) {
    res.redirect('/login')
  }
  const dbskills = db.get('skills')
  const skills = {
    age: dbskills[0].number,
    concerts: dbskills[1].number,
    cities: dbskills[2].number,
    years: dbskills[3].number,
  }
  res.render('pages/admin', { title: 'Admin page', skills})
})

router.post('/skills', (req, res, next) => {
  const reqSkills = Object.values(req.body)
  const skills = db.get('skills')

  let index = 0
  const newSkills = skills.map((skill) => {
    skill.number = Number(reqSkills[index])
    index++
    return skill
  })

   db.set('skills', newSkills)
   db.save()
  res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()
  const photoDir = path.join('./public', 'uploads')
  form.uploadDir = path.join(process.cwd(), photoDir)

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err)
    }
    const fileName = path.join(photoDir, files.photo[0].originalFilename)
    fs.rename(files.photo[0].filepath, fileName, function(err) {
      if (err) {
        console.log(err.message)
        return false
      }
    })
    const dir = fileName.substring(fileName.indexOf('\\'))
    const products = db.get('products')
    db.set('products', [...products, {src: dir, name: fields.name[0], price: Number(fields.price[0])}])
    db.save()
  })

  res.redirect('/admin')
  
})

module.exports = router