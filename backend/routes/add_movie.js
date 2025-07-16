const express = require('express');
const router = express.Router();
const Users = require('../db/models/Users');
const Movies = require('../db/models/Movies');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/enum');
const Auth = require('../lib/Auth')();
const Audit = require('../lib/Auditlogs');



router.post('/',Auth.authenticate(),async (req,res) => {
    try{
        const user_id = req.user.id;
        const {movie_name,category} = req.body;
        let user = await Users.findOne({_id:user_id});
        let movie = await Movies.findOne({movie_name});

        if(!user) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Invalid Request.','There is no such user!');
        if(!user.isMod || user.isBanned) throw new CustomError(Enum.HTTP_CODES.FORBIDDEN,'Permission Denied.','This user is banned or not mod.');
        if(movie) throw new CustomError(Enum.HTTP_CODES.CONFLICT,'There is a conflict.','This movie is already registered.');

        const newMovie = new Movies({
            movie_name,
            category,
        });

        await newMovie.save();
        Audit.info(user.username,'add_movies','Add','Added');
        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(newMovie,Enum.HTTP_CODES.CREATED));
        
    }
    catch(err){
        res.status(err.code || Enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(err));
    }
});


module.exports = router;