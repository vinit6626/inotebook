const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const  bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'HelloIAmReact';
//Route 1: create a user using : POST "/api/auth/createuser" No login required
router.post('/createuser',[
    body('name').isLength({ min: 3 }),
    body('email',"Enter a valide email").isEmail(),
    body('password').isLength({ min: 5 }), 
],async(req, res)=>{
  let success = false;
  //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // console.log(user)
    try {
      //check whether the user with the email exists already
    let user =  await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).json({success, error: "Sorry a user with this email already exisits."})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET); //verify user

      // res.json({user})
      success = true;
      res.json({success,authtoken})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal surver error.");
    }
})


//Route 2: Authrenticate a user using : POST "/api/auth/login" No login required
router.post('/login',[
  body('email',"Enter a valide email").isEmail(),
  body('password', 'password cannot be blank').exists(), 
],async(req, res)=>{
  
  let success = false;
   //if there are errors return bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email, password} = req.body;
   try {
    let user = await User.findOne({email});
    
    if(!user){
      success = false
      return res.status(400).json({ error:"Please try to login with correct credentials."});
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({ error:"Please try to login with correct credentials."});
    }
    
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET); //verify user
    success = true;
    // res.json({user})
    res.json({success, authtoken})
    
    
   } catch (error) {
     
    console.log(error.message);
    res.status(500).send("Internal surver error");
   }
})


//Route 3: Get logging user detail using  : POST "/api/auth/getuser"  login required
router.post('/getuser', fetchuser ,async(req, res)=>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user)
} catch (error) {
  console.log(error.message);
  res.status(500).send("Internal surver error.");
}
})




module.exports = router
