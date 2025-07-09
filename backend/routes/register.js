const express = require('express');
const router = express.Router();
const Users = require('../db/models/Users');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/enum');
const bcrypt = require('bcrypt-nodejs');
const is = require('is_js');
const jwt = require('jwt-simple');
const config = require('../config');



//CREATE USER
router.post('/',async (req,res) => {
    try{
        const {username,password,email,isMod} = req.body;
        if(!username || !password || !email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Invalid request!','All fields must be filled!');
        let existingUser = await Users.findOne({ username});
        if(existingUser) throw new CustomError(Enum.HTTP_CODES.CONFLICT,'There is a conflict!','This username is already taken!');
        if(password.length < Enum.PASS_LENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Invalid request!','Pasword must greater than ' +Enum.PASS_LENGTH);
        if(is.not.email(email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Invalid Error','Email field must be a email format.');
        const user =await Users.create({
            username,
            password:bcrypt.hashSync(password,bcrypt.genSaltSync(8),null),
            email,
            isMod,
        });
        const userData = {
            username,
            email,
            isMod,
        };
        let payload = {
            id: user._id,
            exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME
        };        
        const token = jwt.encode(payload, config.JWT.SECRET);
        res.json(Response.succesResponse({token,user:userData},Enum.HTTP_CODES.CREATED));
        
    }catch(err){
        res.status(err.code || Enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(err));
    }
});




module.exports = router;