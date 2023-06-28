/**
* routes/index.routes.js ...
* Social Authenfication index routes ...
*/

const express = require('express')
const router = express.Router()
const connectEnsureLogin = require("connect-ensure-login")

// Index route ...
router.get("/", connectEnsureLogin.ensureLoggedIn("/login/"), (req, res) => {
  res.render( "index", { title: "Social.Auth"} )
})

// Login route ...
router.get("/login/", (req, res) => {
  res.render( "auth", { title: "Social.Auth" } )
})

// Profile route ...
router.get("/profile/", connectEnsureLogin.ensureLoggedIn("/login/"), (req, res) => {
  res.render( "profile", { title: "Social.Auth", user: req.user } )
})

// Error route ...
router.get("/error/", (req, res) => {
  res.send( "Error logging in." )
})

module.exports = router