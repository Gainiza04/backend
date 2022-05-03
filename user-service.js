const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, first_name = null, last_name = null, phone = null, age = null
        , googleId = null, image = null) {
        // check: if such a user is in the database
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('User with this email address already exists')
        }

        const hashPassword = await bcrypt.hash(password, 4) // hash the password
        const user = await UserModel.create({
            email,
            password: hashPassword,
            image,
            first_name,
            last_name,
            phone,
            age,
            roles: ["USER"]
        }) // save user to database
        const userDto = new UserDto(user) // (data to transfer) id, email, isActivated, roles

        return {user: userDto}
    }

    async login(email, password, done) {
        const user = await UserModel.findOne({email})
        if (!user) {
            done(null, false)
            throw ApiError.BadRequest('User with this email address already exists')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            done(null, false)
            throw ApiError.BadRequest('Wrong password')
        }
        const userDto = new UserDto(user)

        done(null, user)

        return {user: userDto}
    }

}

module.exports = new UserService()