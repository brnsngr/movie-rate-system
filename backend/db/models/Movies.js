const mongoose = require('mongoose');

const schema = mongoose.Schema({
    movie_name: {type: String, required:true, unique:true},
    category: {type: String, required:true,},
    rating: {type:Number, default: 0},
    votes: {type:Number, default: 0},
})

class Movies extends mongoose.Model {
     
}

schema.loadClass(Movies);
module.exports = mongoose.model('movies',schema);