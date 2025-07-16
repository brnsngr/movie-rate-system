const mongoose = require('mongoose');
const {PASS_LENGTH,HTTP_CODES} = require('../../config/enum');
const is = require('is_js');
const bcrypt = require('bcrypt-nodejs');
const CustomError = require('../../lib/Error');

const schema = mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    isMod: {type: Boolean, default:false},
    isBanned: {type:Boolean, default:false},
});

class Users extends mongoose.Model {


    validPassword(password){
        return bcrypt.compareSync(password,this.password);
    }
     
    static validateFieldsBeforeAuth(username,email,password){
        if(typeof password !== 'string' || password.length < PASS_LENGTH || is.not.email(email) || typeof username !== 'string'){
            throw new CustomError(HTTP_CODES.UNAUTHORIZED,'Validiation Error','username or email or password wrong');
        }
        return null;
    }
}

schema.loadClass(Users);
module.exports = mongoose.model('users',schema);