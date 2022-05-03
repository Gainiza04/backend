const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model')
const userService = require('../services/user-service')

module.exports = function (passport, req, res) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const userData = await userService.login(username, password, done)
                console.log(userData)
            } catch (e) {
                console.log(e)
            }
        }
    ));
}