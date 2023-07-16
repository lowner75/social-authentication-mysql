/**
* routes/auth.routes.js ...
* Social Authentication auth routes ...
*/

const express = require('express')
const router = express.Router()
const db = require("../config/database")
const argon2 = require("argon2");

// Change password API ...
router.post("/change-password/", async (req, res) => {

  console.log(JSON.stringify(req.body)) // For debugging ...

  // CHeck user is logged in ...
  if (req.isAuthenticated()) {

    // First check if existing password matches ...
    if (req.user[0]) req.user = req.user[0]
    const passwordVerified = await argon2.verify(req.user.password, req.body.oldPassword);
    if (passwordVerified === false) {
      return res.status(400).send({ success: false, message: "Error: Incorrect password" });
    } else {
      console.log(true)
      return res.status(200).send({ success: true, message: "Password matches." });
    }

  } else {
    return res.status(400).send({ success: false, message: "Error: You are currently ogged out. Please log back in to make changes" });
  }

})
  
module.exports = router