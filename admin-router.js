const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const userResource = require('../admin/resources/user-resource')
const panelLocale = require('../admin/resources/panel-locale')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
    databases: [mongoose],
    ...panelLocale,
    branding: {
        companyName: 'SneakShop',
        softwareBrothers: false,
        logo: '',
    },
    resources: [{
        resource: User,
        options: {
            ...userResource
        },
    },
        ]
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        try {
            const user = await User.findOne({email})
            console.log(user.roles)
            let hasRole = false
            user.roles.forEach(role => {
                if ("ADMIN".includes(role))
                    hasRole = true
            })
            if (!hasRole) return false
            if (user) {
                const matched = await bcrypt.compare(password, user.password)
                if (matched) return user
            }
            return false
        } catch (e) {
            console.log(e)
        }
    }
})

module.exports = router

