/**
* routes/auth.routes.js ...
* Social Authentication auth routes ...
*/

const express = require('express')
const router = express.Router()
const passport = require("passport")
const db = require("../config/database")
const argon2 = require("argon2");

// Sign-up auth route ...
router.post('/sign-up/', 
	async (req, res) => {

		// Use Argon2 to hash password ...
		let password = req.body.password
		try {
			const hash = await argon2.hash(password, {
				type: argon2.argon2id,
				memoryCost: 2 ** 16,
				hashLength: 100,
			});
			password = hash
		} catch (err) {
			console.error(err)
		}

		// Check if user already exists ...
    db.query("select * from user where email = ? ", [req.body.email],
      (err, user) => {
        if (err) {
					return res.status(500).json({ success: "failure", err: err })
				}
        if (!err && user.length !== 0) {
					// user already existis. Update account with password ...
					db.query("update user set password = ? where email = ?", [password, req.body.email],
						(err, update) => {
							console.log(err)
							db.query("select * from user where email = ?", [req.body.email],
							(err, user) => {
								console.log(user)
								req.login(user, (err) => {
									if (err) return next(err)
									return res.status(200).json({ success: true })
								})
							})
						}
					)
				} else {
					db.query("insert into user set fname = ?, lname = ?, email = ?, password = ?, provider = 'Local' user_active = 1", [req.body.fname, req.body.lname, req.body.email, password],
						(err, user) => {
							if (err) {
								return res.status(500).json({ success: "failure", err: err })
							}
							db.query("select * from user where email = ?", [req.body.email],
							(err, user) => {
								if (err) {
										return res.status(500).json({ success: "failure", err: err })
									}
									req.login(user, (err) => {
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
        return res.status(200).json({ redirect: "/" });

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