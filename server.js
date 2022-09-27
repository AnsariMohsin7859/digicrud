
const express = require ('express');

const app = express ();

require('dotenv').config()

//db connection 
const db = require('./config/config')

app.use(express.json())

//require user route 
const userRoute = require('./routes/userRoute')


app.use('/v1/user' , userRoute)










//demo api for testing 
app.get('/demo' , (req , res)=>{
    console.log("demo api is working server connection is fine");

    return res.send('demo api is working server connection is fine')
})






//port 
const port = process.env.PORT || 3010

//server connection 
app.listen(port , (err)=>{
if (err) {
    console.log("unable to connect server "+err);
}else
{
    console.log("sever is up and running on port "+port);
}
})