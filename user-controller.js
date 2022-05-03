const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController{
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const {email, password, first_name, last_name, phone, age} = req.body
            await userService.registration(email, password, first_name, last_name, phone, age)
            return next()
        }
        catch (e) {
            next(e)
        }
    }
    async logout(req, res, next){
        try{
            req.logout()
            res.redirect('/')
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()