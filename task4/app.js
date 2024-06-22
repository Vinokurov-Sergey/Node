const koa = require('koa')
const static = require('koa-static')
const session = require('koa-session')
const koaPug = require('koa-pug')

const router = require('./routes')
const errorHandler = require('./libs/error')

const app = new koa()

const pug = new koaPug({
  app: app,
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCashe: true
})

pug.use(app)
app.use(static('./public'))
app.use(errorHandler)

app.on('error', (err, ctx) => {
  ctx.response.body = {}
  ctx.render('pages/error', {
    status: ctx.response.status,
    error: ctx.response.message
  })
})

app.use(session({
  key: 'sessionKey',
  maxAge: 'session',
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false
}, app))

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {})
