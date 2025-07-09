const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user_id: {type: mongoose.SchemaTypes.ObjectId, required: true,},
    movie_id:{type: mongoose.SchemaTypes.ObjectId, required: true,},
    rating: Number,
})

class User_Movies extends mongoose.Model {
     
}

schema.loadClass(User_Movies);
module.exports = mongoose.model('user_movies',schema);