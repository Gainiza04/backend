const Router = require('express').Router
const userController = require('../controllers/user-controller')
const passport = require('passport')
const {body} = require('express-validator')
const authMiddleware = require("../middlewares/auth-middleware")
const Sneaker = require('../models/sneaker-model')
const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 7}),
    authMiddleware.ensureGuest, userController.registration,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/signup"
    }));

router.post('/login', authMiddleware.ensureGuest,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/signin"
    }));

// ---Logout---

router.get('/logout', userController.logout);

// ---Views---

router.get('/shopping', async (req, res) => {
    try {
        const sneakers = await Sneaker.find().lean()
        res.render('pages/shopping.ejs', {sneakers: sneakers})
    }
    catch (e) {
        console.log(e)
    }
});

router.get('/about', (req, res) => {
    res.render('pages/about.ejs')
});

router.get('/signup', authMiddleware.ensureGuest, (req, res) => {
    res.render('pages/signup.ejs')
});

router.get('/signin', authMiddleware.ensureGuest, (req, res) => {
    res.render('pages/signin.ejs')
});

router.get('/payment', (req, res) => {
    res.render('pages/payment.ejs')
});

router.get('/profile', authMiddleware.ensureAuth, (req, res) => {
    res.render('pages/profile.ejs', {user: req.user})
});

module.exports = router;