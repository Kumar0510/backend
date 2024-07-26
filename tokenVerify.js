let jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    //middleware to verify token
    let bearerToken = req.headers.authorization;
    if(bearerToken === undefined) res.send({message: "unauthorized access!"});
    const token = bearerToken.split(' ')[1];
    try{
        let decode = jwt.verify(token, 'abcdef');
        next();
    }catch{
        res.send({message: "TOken expired"});
    }
    
}
module.exports = verifyToken;