 const express = require("express");
 const app = express();

//  app.use(logger);
//  app.use(oneMoreLogger);
  
 // immplimenting the REST API  
app.get("/",(req,res)=>{
    console.log("routehandler")
    return res.send({ name : req.name})
})

function logger(data){   // this is a normal function that collect data as arrgument and that a return middile ware  
    return function (req,res,next){  // this function is your middleware and this function run by your express
        req.name = data 
        console.log("before")
         next();
         console.log("after")
    } 
}

app.get("/users", oneMoreLogger,logger("dhawal"),(req,res)=>{
      return res.send({ name : req.name})
})

function oneMoreLogger(req,res,next){
    console.log("before oneMore")
    next();
    console.log("after oneMore")

}


 app.listen(2345, ()=>{
    console.log("port is listinpning on port 2345")
 })