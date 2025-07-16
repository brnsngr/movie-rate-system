const express = require('express');
const router = express.Router();
const Users = require('../db/models/Users');
const User_Movies = require('../db/models/User_Movies');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/enum');
const Auth = require('../lib/Auth')();
//GET YOUR HOME PAGE
router.get('/',Auth.authenticate(),async (req,res) => {
    try{
        let user = await Users.findOne({_id: req.user.id});
        if(!user) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Validation Error','There is no such user.');
        if(user.isBanned) throw new CustomError(Enum.HTTP_CODES.FORBIDDEN,'Forbidden','This user is banned.')
        let movies = await User_Movies.find({user_id:user._id});
        let user_data = {
            username:user.username,
            email:user.email,
            movies
        }

        res.json(Response.successResponse(user_data));        
    }catch(err){
        res.status(err.code || Enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(err));
    }

    

});

module.exports = router;