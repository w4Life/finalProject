if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError')
const campgroundsRoute = require('./routes/campground.js')
const reviewsRoute = require('./routes/reviews.js')
const usersRoute = require('./routes/user')
const User = require('./models/user')

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

mongoose.connect(`mongodb://${username}:${password}@127.0.0.1:27017/yelp-camp`)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('CONNECTED TO MONGO')
});

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
})

app.use(sessionConfig)
app.use(flash())
 
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:camp_id/reviews', reviewsRoute)
app.use('/', usersRoute)

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'SOMETHING WENT WRONG'} = err
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('LISTENING AT PORT 3000')
})