/**
* middleware/passport.google.js ...
* Social Authentication Passport JS Google OAuth2 Strategy ...
*/

const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const db = require("../config/database")

// Passport Google OAuth2 strategy ...
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  (request, accessToken, refreshToken, profile, done) => {
    //console.log(profile)
    // Check if user exists, based upon Google id ...
    db.query(
      "select * from user where google_id = ? ", [profile.id],
      (err, user) => {
        if (err) {
          console.log(err)
          done(err, false)
        }
        if (!err && user.length != 0) {
          // If user exists ...
          db.query("update user set provider = 'Google'")
          return done(null, user)
        } else {
          // If not, check if the user's email is already registered, for example,
          // through a local strategy, or another social strategy, such as Facebook ...
          db.query(
            "select * from user where email = ? ", [profile.emails[0].value],
            (err, user) => {
              if (!err && user.length != 0) {
                // If email is already registered, update user account with latest Google data: google_id, google_img ...
                db.query("update user set google_id = ?, google_img = ?, provider = 'Google'", [profile.id, profile.photos[0].value])
                return done(null, user)
              } else {
                // If user doesn't have an existing account, add them to the database ...
                db.query("insert into user set fname = ?, lname = ?, google_id = ?, google_img = ?, email = ?, provider = 'Google', user_active = 1",
                  [profile.name.givenName, profile.name.familyName, profile.id, profile.photos[0].value, profile.emails[0].value],
                  (err, user) => {
                    if (err) {
                      console.log(err)
                      return done(err, false);
                    } else {
                      db.query(
                        "select * from user where google_id = ?", [profile.id],
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