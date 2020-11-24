const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')

require('dotenv').config()

//ANCHOR Routes
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')

//ANCHOR Mongoose Connection
mongoose
    .connect(process.env.DATABASE, {
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

//ANCHOR Teste Enviado/Recebido
/*app.use(express.json())
app.get('/', (req, res)=> {
    console.log('Recebido')
    res.json({"message": "Enviado"})
})*/

//ANCHOR Port
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})
