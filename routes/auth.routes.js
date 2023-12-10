/**
* routes/auth.routes.js ...
* Social Authentication auth routes ...
*/

const express = require('express')
const router = express.Router()
const passport = require("passport")
const argon2 = require("argon2");
const db = require("../config/database")

// Sign-up auth route ...
router.post('/sign-up/', 
	async (req, res) => {

		// Use Argon2 to hash password ...
		let password = req.body.password
		try {
			const hash = await argon2.hash(password, {
				type: argon2.argon2id,
				memoryCost: 2 ** 16,
				hashLength: process.env.ARGON2_HASHLENGTH,
			});
			password = hash
		} catch (err) {
			console.error("Hash error:", err)
		}

		// Check if user already exists ...
    db.query("select * from user where email = ? ", [req.body.email],
      (err, user) => {
        if (err) return res.status(500).json({ success: false, err: err })
        if (!err && user.length !== 0) {
          // User already exists ...
          return res.status(400).json({ success: false, err: "User already exists." })
				} else {
					// New user ...
          if (req.body.fname === undefined || req.body.fname === null || req.body.fname === "" ||
              req.body.lname === undefined || req.body.lname === null || req.body.lname === "" ||
              req.body.email === undefined || req.body.email === null || req.body.email === "" ||
              req.body.password === undefined || req.body.password === null || req.body.password === "") return res.status(500).json({ success: false, err: "Please complete all requested fields." })
					db.query("insert into user set fname = ?, lname = ?, email = ?, password = ?, provider = 'Local', user_active = 1", [req.body.fname, req.body.lname, req.body.email, password],
						(err, user) => {
							if (err) return res.status(500).json({ success: false, err: err })
							db.query("select * from user where email = ?", [req.body.email],
							(err, user) => {
								if (err) return res.status(500).json({ success: false, err: err })
									req.login (user, (err) => {
										if (err) return next(err)
										return res.status(200).json({ success: true })
									})
								}
							)
						}
					)
				}
			}
		)
	}
)

// Passport local auth route ...
router.post('/', 
	(req, res) => {
		
    //console.log(req.body) // For debugging ...
		passport.authenticate('local', (err, user, info) => {
			if (err || !user) {
        console.log(err)
				return res.status(400).json(err)
			}
			req.login(user, (err) => {
				if (err) return res.status(500).send(err);
				if (user.user_admin === 1) {
					res.locals.admin = true
				}

				// On success ...
        return res.status(200).json({ redirect: "/profile/" });

			})
		}
	)(req, res)
})

// Google auth route ...
router.get("/google", 
  passport.authenticate("google", { scope : ["profile", "email"] })
)

// Google auth callback route ...
router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/error/" }),
  (req, res) => {

		// On success ...
		res.redirect("/profile/")

	}
)

// Facebook auth route ...
router.get("/facebook", 
  passport.authenticate("facebook", { scope : ["public_profile", "email"] })
)

// Facebook auth callback route ...
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error/' }),
	(req, res) => {

		// On success ...
		res.redirect("/profile/")

	}
)
  
module.exports = router