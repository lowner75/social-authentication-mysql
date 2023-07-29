/**
* middleware/passport.facebook.js ...
* Social Authentication Passport JS Facebook Strategy ...
*/

const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy;
const db = require("../config/database")

// Passport Facebook strategy ...
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'name', 'email', 'photos', 'verified'],
  },
  (accessToken, refreshToken, profile, done) => {
    //console.log("Facebook Profile", profile)
    // Check if user exists, based upon Facebook id ...
    db.query(
      "select * from user where facebook_id = ? ", [profile.id],
      (err, user) => {
        if (err) {
          console.log(err)
          done(err, false)
        }
        if (!err && user.length != 0) {
          // If facebook id already exists ...
          if (user[0]) user = user[0] // Prevents user object being saved as array ...
          db.query("update user set provider = 'Facebook'")
          return done(null, user)
        } else {
          // If not, check if the user's email is already registered, for example,
          // through a local strategy, or another social strategy, such as Google ...
          db.query(
            "select * from user where email = ? ", [profile.emails[0].value],
            (err, user) => {
              if (user[0]) user = user[0] // Prevents user object being saved as array ...
              if (!err && user.length != 0) {
                // If email is already registered, update user account with latest Facebook data: facebook_id, facebook_img ...
                db.query("update user set facebook_id = ?, facebook_img = ?, provider = 'Facebook' where email = ?", [profile.id, profile.photos[0].value, profile.emails[0].value], (err, user) => {
                  db.query("select * from user where facebook_id = ?", [profile.id],
                    (err, user) => { if (err) console.log(err); return done(null, user) })
                })
              } else {
                // If user doesn't have an existing account, add them to the database ...
                db.query("insert into user set fname = ?, lname = ?, facebook_id = ?, facebook_img = ?, email = ?, provider = 'Facebook', user_active = 1",
                  [profile.name.givenName, profile.name.familyName, profile.id, profile.photos[0].value, profile.emails[0].value],
                  (err, user) => {
                    if (err) {
                      console.log(err)
                      return done(err, false);
                    } else {
                      db.query(
                        "select * from user where facebook_id = ?", [profile.id],
                        (err, user) => {
                          if (err) console.log(err)
                          return done(null, user);
                      })
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }
))

passport.serializeUser((user, done) => { done(null, user) })
passport.deserializeUser((user, done) => { done(null, user) })