const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("./db/db.config");

    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        const user = await pool.query('SELECT * FROM users WHERE email=$1', [ email ]);
            if (!user.rows.length > 0) {
                return done(null, false, { message: "No user with that email" })
            }
            try {
               if (await bcrypt.compare(password, user.rows[0].password)) {
                   return done(null, user)
               } else {
                   return done(null, false, { message: 'Password incorrect' })
               }
            } catch (error) {
               if (error) {
                   return done(error)
               }
           }
    }));
    passport.serializeUser((user, done) => done(null, user.rows[0].id));
    passport.deserializeUser(async (id, done) => {
        await pool.query('SELECT * FROM users WHERE id=$1', [id], (err, user) => {
            if (err) return done(err)
            return done(null, user)
        });
    });

module.exports = passport;