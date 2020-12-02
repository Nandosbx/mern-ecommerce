const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
const env = require('dotenv')
const config = require('./config/key')

//NOTE Routes
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const braintreeRouter = require('./routes/braintree')
const orderRouter = require('./routes/order')

//NOTE Variables
env.config()

const app = express()

//NOTE Mongoose Connection
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.log('Database error: ', error))

//NOTE Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//NOTE Routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', braintreeRouter)
app.use('/api', orderRouter)

//NOTE Port
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})
