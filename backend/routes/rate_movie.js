const express = require('express');
const router = express.Router();
const User_Movies = require('../db/models/User_Movies');
const Users = require('../db/models/Users');
const Movies = require('../db/models/Movies');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/enum');
const Auth = require('../lib/Auth')();



router.post('/',Auth.authenticate(),async (req,res) => {
    try{
        const user_id = req.user.id;
        const { movie_name, rating } = req.body;
        let existingMovie = await Movies.findOne({movie_name});
        if(!existingMovie) throw new CustomError(Enum.HTTP_CODES.CONFLICT,'There is a conflict!','This movie is already registered.');
        if(req.body.rating>5 || req.body.rating<0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,'Invalid Request','Rating must be between 0 and 5!');
        const existingUserRating = await User_Movies.findOne({user_id,movie_id:existingMovie._id});
        let newVotes = existingMovie.votes;
        let newRating = existingMovie.rating;

        if(existingUserRating){
            newRating = ((existingMovie.rating * existingMovie.votes) - existingMovie.rating + rating)/newVotes;
        }else {
            newVotes += 1;
            newRating = ((existingMovie.rating * existingMovie.votes) + rating)/newVotes;
        }



        let user_movie = await User_Movies.updateOne(
            {user_id,movie_id: existingMovie._id},
            {$set: 
                {rating}},
                {upsert:true});
        await Movies.updateOne(
            {_id: existingMovie._id},
            {$set:{rating: newRating, votes: newVotes}})

        res.json(Response.succesResponse({succes:true}));
        

    }
    catch(err){
        res.status(err.code || Enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(err));
    }
})



module.exports = router;