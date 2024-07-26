//create http server
const express = require('express')
const app = express();
//import mongoclient
const {MongoClient}= require('mongodb');
app.use(express.json())
//connecting to Mongo db server
let mCLient = new MongoClient("mongodb://127.0.0.1:27017");

mCLient.connect()
.then((connectionObj)=>{
    console.log("MongoDB connected");
    //connect to database that is julydb
    const julydb = connectionObj.db('julydb');
    //connect to users collection
    const usersCollec = julydb.collection('users');

    //to use users collection across the files
    app.set('usersCollec',usersCollec);
    //assign port to http server
    app.listen(4000, ()=>{console.log('server started on port 4000');});
})
.catch((err)=>{console.log("Error while connecting to mongo");})

//to seperate the users api request handlers and product api req handlers into seperate files 
const userApp = module.require("./APIs/userApi");
const productApp = module.require("./APIs/productApi");
app.use('/user-api', userApp);
app.use('/products-api', productApp);
app.use('*', (req,res,)=>{
    res.send({message: "invalid path"});
})

app.use((err, req, res, next)=>{
    res.send({message:"Error in code", errorMessage:`${err.message}`});
})
