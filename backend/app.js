const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

require('dotenv').config()

//ANCHOR Routes
const userRouter = require('./routes/user')

//ANCHOR Mongoose Connection 
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database is connected'))

//ANCHOR Middlewares
app.use(bodyParser.json())
app.use(cookieParser())

//ANCHOR ROTAS rotas de middleware
app.use('/api', userRouter)


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
