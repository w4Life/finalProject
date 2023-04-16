const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        req.login(registeredUser, () => {
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back')
    res.redirect('/campgrounds')
}

module.exports.logout = (req, res) => {
    req.logout(() => {
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
}