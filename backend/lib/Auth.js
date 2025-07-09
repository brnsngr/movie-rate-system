const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const config = require('../config');
const Users = require('../db/models/Users');
const User_Movies = require('../db/models/User_Movies');

module.exports = function () {
  const strategy = new Strategy(
    {
      secretOrKey: config.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await Users.findOne({ _id: payload.id });
        if (user) {
          // const user_movies = await User_Movies.find({ user_id: payload.id });
          done(null, {
            id: user._id,
            email: user.email,
            exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME,
          });
        } else {
          done(new Error('User not found.'), null);
        }
      } catch (err) {
        done(err, null);
      }
    }
  );

  // ✅ Stratejiyi passport'a burada tanımlıyorsun
  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate('jwt', { session: false });
    },
  };
};



