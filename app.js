import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import session from 'express-session'

import user_router from './routes/user_route.js'
import connect_db from './database/db.js'

const app = express()
const PORT = process.env.PORT || 4000
const DB_URL = process.env.DB_URL

connect_db(DB_URL)

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static('public'));

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message,
    delete req.session.message
    next()
})

app.set('view engine', 'ejs')

app.use('/', user_router)



app.listen(PORT, (err) => {
    if(err) throw err
    console.log(`SERVER LISTENING ON PORT ${PORT}`)
})