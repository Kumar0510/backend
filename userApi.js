const express = require('express')
const userApp = express.Router();
const bcryptjs = require('bcryptjs');

let jwt = require('jsonwebtoken');
// to verify the jwt token
let verifyToken = require('../middleware/tokenVerify');
let expressAsyncHandler = require('express-async-handler');

//route for get users
userApp.get('/users',verifyToken, expressAsyncHandler(async (req, res)=>{
    //get users collection obj
    const usersCollec = req.app.get('usersCollec');
    //get users data from db
    let users = await usersCollec.find().toArray();
    //send data to http client
    res.send({message: "from users", payload : users});
}))


userApp.get('/users/:username', async (req, res)=>{
    const usersCollec = req.app.get('usersCollec');
    let userCred = req.params.username;
    //get users data from db
    let users = await usersCollec.findOne({username : userCred});
    //send data to http client
    if(users === null)
    res.send({message: "no user found"});
})

/*
userApp.get('/users/:username', async (req, res) => {
    const usersCollec = req.app.get('usersCollec');
    let usercredUsername = req.params.username;
    let users = await usersCollec.findOne({username : usercredUsername});

    if(users === null) res.send({message: "user not exixts"});
})

*/
//route for post user
userApp.post('/users', async (req, res) =>{
    const usersCollec = req.app.get("usersCollec");
    let newUser = req.body;
    let userExist = await usersCollec.findOne({username : newUser.username});

    if(userExist !== null){
        res.send({message:"User already exits"});
    }else{
        let hashedPassword = await bcryptjs.hash(newUser.password, 7);
        newUser.password = hashedPassword;
        await usersCollec.insertOne(newUser);
        res.send({message: "User created"});
    }
    
})

//login with user authentications
userApp.post('/login', async (req, res)=>{
    const usersCollec = req.app.get('usersCollec');
    const userCred = req.body;

    let findInDbUser = await usersCollec.findOne({username : userCred.username});
    if(findInDbUser === null){
        res.send({message: "Username is invalid"});
    }
    else {
        let passcheck = bcryptjs.compare(userCred.password, findInDbUser.password);
        if(passcheck === false) req.send({message: "password is invalid"});
        else{
            //create jwt token
            let signedToken = jwt.sign({username:userCred}, 'abcdef', {expiresIn:'1d'})
            res.send({message: "login success", token:signedToken, users:findInDbUser});
        }
    }
});

//Protected routes PUT DELETE
// route to update user
userApp.put('/user', async (req, res) =>{
     usersCollec = req.app.get('userCollec');
     let modifiedUser = req.body;
     await usersCollec.updateOne({username: modifiedUser.username}, {$set :{...modifiedUser}})
    
     
})
// route to delete user
userApp.delete('/user/:id', (req, res) =>{
    
})


module.exports = userApp;