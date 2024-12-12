// This file should set up the express server

import express from 'express'
const app = express()
import configRoutes from './routes/index.js'
import exphbs from 'express-handlebars'

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method
    delete req.body._method
  }

  // Let the next middleware run:
  next()
}

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing))

      return new Handlebars.SafeString(JSON.stringify(obj))
    },

    partialsDir: ['views/partials/']
  }
})

app.use('/public', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(rewriteUnsupportedBrowserMethods)

app.engine('handlebars', handlebarsInstance.engine)
app.set('view engine', 'handlebars')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


configRoutes(app)

app.listen(3000, () => {
  console.log("We've now got a server!")
  console.log('Your routes will be running on http://localhost:3000')
})
