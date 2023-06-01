const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
let Validator = require("validatorjs");
let reply = require("../common/reply.js");
const fs = require("fs");
const crypto = require("crypto");
const Token = require("../models/Token.js");





const RegisterUser = async (req, res) => {
  const request = req.body;
  const rules = {
    name: "required|string|min:3",
    email: "required|string",
    password: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  try {
    let userExit = await User.findOne({ email: request.email });
    if (userExit) {
      return res.json(reply.failed("User already exists"));
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hash(request.password, salt);
    request["avatar"] = gravatar.url(request.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    request["password"] = hash;
    const user = await User.create(request);
    return res.json(reply.success("User Create", user));
  } catch (err) {
    console.log(err);
  }
};

const Auth = async (req, res) => {
  const request = req.body;

  const rules = {
    email: "required|string",
    password: "required|string",
  };

  let validation = new Validator(request, rules);
  
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  const UserInfo = await User.findOne({ email: request.email });
  if (!UserInfo) {
    return res.json(reply.failed("User Does not exits"));
  }

  if (UserInfo) {
    const isMatch = await bcrypt.compare(request.password, UserInfo?.password);
    if (!isMatch) {
      return res.json(reply.failed("Invalid Credentails"));
    }
  }
  var PrivateKey = fs.readFileSync("./key/private.pem", "utf-8");
  var cryptos = crypto.randomBytes(50).toString("hex");

  var token = jwt.sign({ cryptos }, PrivateKey, {
    expiresIn: "2h",
    algorithm: "RS256",
  });
  try {
    await Token.create({
      t_id: cryptos,
      u_id: UserInfo?._id,
      email: UserInfo?.email,
    });
    return res.json(
      reply.success("User Login", { email: UserInfo.email, token: token })
    );
  } catch (err) {
    console.log(err);
  }
};

// Get authorized user
const GetAuthUser=async (req,res)=>{
  try{
      const user=await User.findById(req.user._id).select('-password')
      if(!user){
       return res.json("User does Authenticate")
      }
      return res.json(reply.success("Authenticate User Found",user))
  }catch(err){
   console.log(err)
   return res.json(reply.failed("Authenticate User Does not found "))
  }
}

module.exports = { RegisterUser, Auth,GetAuthUser };
