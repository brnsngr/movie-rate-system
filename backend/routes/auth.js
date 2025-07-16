const express = require('express');
const router = express.Router();
const Users = require('../db/models/Users');
const Movies = require('../db/models/Movies');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/enum');
const config = require('../config');
const jwt = require('jwt-simple');
const Audit = require('../lib/Auditlogs');

router.post('/',async (req,res) => {
    try{
        let {username,email,password} = req.body;
        Users.validateFieldsBeforeAuth(username,email,password);
        let user = await  Users.findOne({ username });
        if(!user) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED,'Validation Error','username or email or password wrong');
        if(!user.validPassword(password)) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED,'Validation Error','username or email or password wrong');
        let payload = {
            id: user.id,
            exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME
        };

        let userData = {
            _id:user._id,
            username:user.username,
            email:user.email
        }
        let token = jwt.encode(payload, config.JWT.SECRET);
        res.json(Response.successResponse({ token,user:userData }));
        Audit.info(user.username,'auth','LOGIN','User successfully authenticated');
        


    }catch(err){
        res.status(err.code || Enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(err));
        Audit.error(user.username || 'unknown','auth','LOGIN_ATTEMPT','Failed login attempt');
        
    }
});

module.exports = router;