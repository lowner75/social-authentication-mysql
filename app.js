/**
* A simple Node.js / Express application using social authentication.
* Authentication is Passport JS based utilising Google OAuth2, Facebook, 
* and local strategies, and uses a MySQL database to store user data upon
* signing up / logging in. The app also allows sign up with email.
*/

// Dependencies ...
const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const cors = require("cors")
const passport = require("passport")
const path = require("path")
require("dotenv").config()
require("./middleware/passport.google")
require("./middleware/passport.facebook")
require("./middleware/passport.local")

// Invoke Express app ...
const app = express()

// Parse content-types: application/x-www-form-urlencoded / application/JSON ...
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Set up view engine ...
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// Define static paths ...
app.use(express.static(path.join(__dirname, "public")))
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')))

// Set up Express session ...
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour / or 60000, 60 seconds for debugging ...
  saveUninitialized: true,
  resave: false
}))

// Initialise Passport JS route call
// and allow Passport to use "express-session"
app.use(passport.initialize())
app.use(passport.session())

// CORS settings ...
const corsOptions = { origin: "http://localhost:3000", credentials: true }
app.use(cors(corsOptions))

// Initialise Express server ...
app.listen(process.env.PORT , () => console.log(`\nApp listening on port ${process.env.PORT}...` ))

// In production serve secure cookies only ...
if (app.get("env") === "production") {
  session.cookie.secure = true; 
}

// Router locations ...
const indexRouter = require('./routes/index.routes');
const authRouter = require("./routes/auth.routes");

// Routes ...
app.use('/', indexRouter);
app.use('/auth/', authRouter);

// Logout route ...
app.all("/logout/", (req, res, next) => {
	res.clearCookie("jwt")
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.redirect('/')
      }
    });
  } else {
    res.end()
  }
})