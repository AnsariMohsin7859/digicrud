const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_URL

const db = mongoose.connect(mongo_url,(err)=>{
    if(err){
        console.log("unable to connect db "+ err);
    }
    else{
        console.log("restapicrud database is connected");
    }
})

module.exports = {db}