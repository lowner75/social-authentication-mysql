/**
* routes/index.routes.js ...
* Social Authenfication index routes ...
*/

const express = require('express')
const router = express.Router()
const connectEnsureLogin = require("connect-ensure-login")
const mailController = require('../controllers/mail.controller');

// Login route ...
router.get("/login/", (req, res) => {
  res.render( "auth", { title: "SocialAuth" } )
})

// Sign-up route ...
router.get("/sign-up/", (req, res) => {
  res.render( "sign-up", { title: "SocialAuth" } )
})

// Reset password route ...
router.get("/reset/", (req, res) => {
  mailController.sendMail()
})

// Index route ...
router.get("/", connectEnsureLogin.ensureLoggedIn("/login/"), (req, res) => {
  res.render( "index", { title: "SocialAuth", user: req.user } )
})  

// Profile route ...
router.get("/profile/", connectEnsureLogin.ensureLoggedIn("/login/"), (req, res) => {
  res.render( "profile", { title: "SocialAuth", user: req.user } )
})

// Admin route ...
router.get("/admin/", connectEnsureLogin.ensureLoggedIn("/login/"), (req, res) => {

  // Check user has admin privileges ...
  if (req.user.user_admin == 1) {
    res.render( "admin", { title: "SocialAuth", user: req.user } )
  } else{
    res.redirect("/login/")  
  }

})

// Error route ...
router.get("/error/", (req, res) => {
  res.send( "Error logging in." )
})

module.exports = router