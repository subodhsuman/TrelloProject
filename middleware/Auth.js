const Token=require("../models/Token.js")
const User = require("../models/User.js");
const Jwt=require("jsonwebtoken");
const fs=require("fs");
const Auth=(req, res, next)=>{
    var bearerHeader = req.headers['authorization'];
    if (bearerHeader == undefined) {
       return res.status(201).json(({status:"fail",message:"Invalid Token"}))
      
    }
    
    var bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
  
    if (!token) {
      return res.status(201).json(({status:"fail",message:"Access Denied!"}))
    }
  
    var publicKey = fs.readFileSync("./key/public.pem", 'utf-8');
     Jwt.verify(token, publicKey, { algorithm: 'RS256' }, async function (err, decoded) {
      if (err) {
        return res.status(201).json(({status:"fail",message:err.message}))
      }
  
      let T = await Token.findOne({t_id:decoded.cryptos });

      if (!T) {
        return res.status(201).json({status:"failed" ,message:"Token expired"})
      }
  
      let user = await User.findOne({_id: T.u_id});
     req.user= user;
     req.t_id=T?.t_id;
    //  console.log("fff",T?.u_id)
     req.u_id=T?.npm;
    next();
  });
  }

  module.exports=Auth;
  