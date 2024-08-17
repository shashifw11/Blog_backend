const mongoose = require("mongoose");

const connect = ()=>{
    try{
       return mongoose.connect("mongodb://127.0.0.1:27017/testing")
    }catch(err){
        console.log("database not connected" , err.message)
    }
}

module.exports = connect; 