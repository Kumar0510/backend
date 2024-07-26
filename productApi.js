const express = require('express');
const productApp = express.Router();

productApp.get('/products', (req, res)=>{
    res.send({
        message: "this is from productApi"
    });
})

module.exports = productApp;