const Router = require('express').Router
const Sneaker = require('../models/sneaker-model')
const router = new Router()

router.get('/:id', async (req, res) => {
    try {
        const sneaker = await Sneaker.findById(req.params.id).lean()
        res.render('sneakers/read.ejs', {sneaker: sneaker})
    } catch (e) {
        console.log(e)
    }
})

module.exports = router