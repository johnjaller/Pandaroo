//import package
const express=require('express')
const handlebars=require("express-handlebars")
const cors=require('cors')
const app=express()
const http=require('http').Server(app)
const io=require('socket.io')(http)

//middleware
app.use(cors())
app.use(express.static("public"))
app.engine("handlebars",handlebars({defaultLayout:"main"}))
app.use(express.urlencoded({extended:false}))
app.set("view engine","handlebars")
app.use(express.json())

//route
app.get('/',(req,res)=>{
    res.send('Hello World')
})


http.listen(8080,()=>{
    console.log('app listeninf to port 8080')
})

module.exports={http,app}