const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
const env = require('dotenv')
const config = require('./config/key')

//ANCHOR Routes
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')

//ANCHOR Variables
env.config()

const app = express()

//ANCHOR Mongoose Connection
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.log('Database error: ', error))

//ANCHOR Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//ANCHOR ROTAS
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)

//ANCHOR Port
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})
