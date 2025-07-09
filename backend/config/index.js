module.exports = {
    'LOG_LEVEL': process.env.LOG_LEVEL || 'debug',
    'CONNECTION_STRING': process.env.CONNECTION_STRING || 'mongodb://localhost:27017/movie_log_system_db',
    'JWT':{
        'SECRET': '123456',
        'EXPIRE_TIME': !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24*60*60
    }
}

