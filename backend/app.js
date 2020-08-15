const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

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
    })
    .then(() => console.log('Database is connected'))
    .catch(error => console.log("Database error: ", error))

//ANCHOR Middlewares
app.use(bodyParser.json())
app.use(cookieParser())


//ANCHOR ROTAS rotas de middleware
app.use('/api', authRouter    )
app.use('/api', userRouter    )
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
