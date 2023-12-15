const fs = require('fs');

fs.mkdir("logs", (err)=>{
    if(err){
        console.log("Couldn't create logs directory");
    }else{
        console.log("Logs Directory created");
    }
});
fs.mkdir("public/uploads", {recursive: true},(err)=>{
    if(err){
        console.log("Couldn't create Public/uploads directory");
    }else{
        console.log("Public/uploads Directory created");
    }
})