const express = require('express');
const User = require('../models/user')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var fetchuser = require('../middleware/fetchuser');

var jwt = require('jsonwebtoken');

const JWT_SECRET ='HelloRajHere@123';
// above express validator will help to validate the data
// Route1 : create user  using POST "/api/auth/createUSer " .Doesn't require auth 
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be of at least 5 charecters').isLength({ min: 5 }),
], async (req, res) => {

    // if there are errors return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // here error will be in the form of the array
    }

   console.log(req.body);
    // check weather the user with this email exist already
   let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

   // create a new user  
    user = await User.create({
        name: req.body.name,
        password :secPass,
        email:req.body.email,
    })


 const data={
    user:{
        id:user.id
    }
}

 //authtoken ki help se waapis convert kr skte data me 
  const authtoken = jwt.sign(data,JWT_SECRET);
   // res.json({ user })
   res.json({success: true, authtoken})
})
 
//Route2 : authenticate user  using POST "/api/auth/login " .Doesn't require auth 

router.post('/login', [
   
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(), 
], async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // here error will be in the form of the array
    }
     const{email,password}=req.body;

     try{
       let user = await User.findOne({email});
       if(!user)
       {
         return  res.status(400).json({error:"Please try to login with correct credentials"});
       }
        const passwordCompare = await bcrypt.compare(password ,user.password);
        if(!passwordCompare)
        { 
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
      
        const data={
            user:{
                id:user._id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        res.json({ success : true ,authtoken});
        
    
     }catch(error)
     {
          console.error(error.message);
          res.status(500).send("Some error occured");
     }
    })
   //Route3 : authenticate user  using POST "/api/auth/getuser " .Require au  th 
   router.post('/getuser', fetchuser , async (req, res) => {
   try{
  userId=req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
   }catch(error)
   {
    console.error(error.message);
    res.status(500).send("Some error occured");
   }
})
module.exports = router 