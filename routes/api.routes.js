/**
* routes/auth.routes.js ...
* Social Authentication auth routes ...
*/

const express = require('express')
const router = express.Router()
const argon2 = require("argon2")
const db = require("../config/database")
const passport = require("passport")

// Update profile API ...
router.post("/update-profile/", async (req, res) => {

  // Check user is logged in ...
  if (req.isAuthenticated()) {
    db.query("update user set fname = ?, lname = ?, email = ? where id = ?", [req.body.fname, req.body.lname, req.body.email, req.user.id])
    return res.status(200).send({ success: true, message: "Profile successfully updated." })
  } else {
    return res.status(401).send({ success: false, message: "Error: You are currently logged out. Please log back in to make changes." })
  }

})

// Clear social media links API ...
router.post("/clear-social/", async (req, res) => {

  // Check user is logged in ...
  if (req.isAuthenticated()) {
    db.query("update user set google_id = null, google_img = null, facebook_id = null, facebook_img = null where id = ?", [req.user.id], (err) => {
      if (err) return res.status(500).json({ success: false, err: err })
      db.query("select * from user where email = ?", [req.user.email], (err, user) => {
        //console.log("mysql user", user)
        // Update user ...
        req.login(user, (err) => {
          if (err) return res.status(500).send(err);
          if (user.user_admin === 1) {
            res.locals.admin = true
          }
        })
        //console.log("req.user", req.user)
        return res.status(200).send({ success: true, message: "Social media links successfully cleared." })
      })
    })
  } else {
    return res.status(401).send({ success: false, message: "Error: You are currently logged out. Please log back in to make changes." })
  }

})

// Change password API ...
router.post("/change-password/", async (req, res) => {

  // Check user is logged in ...
  if (req.isAuthenticated()) {

    // First check if existing password matches ...
    const passwordVerified = await argon2.verify(req.user.password, req.body.oldPassword)
    if (passwordVerified === false) {
      return res.status(400).send({ success: false, message: "Error: Incorrect password." })
    } else {

      // Use Argon2 to hash the new password ...
      let password = req.body.newPassword
      try {
        const hash = await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          hashLength: Number(process.env.ARGON2_HASHLENGTH),
        })
        password = hash
      } catch (err) {
        console.error(err)
      }

      db.query("update user set password = ? where id = ?", [password, req.user.id])
      return res.status(200).send({ success: true, message: "Password successfully updated." })

    }

  } else {
    return res.status(401).send({ success: false, message: "Error: You are currently logged out. Please log back in to make changes." })
  }

})
  
module.exports = router