class Response{
    constructor(){}

    static successResponse(data,code=200){
        return{
            code,
            data,
        }
    }

    static errorResponse(error,code){
        return{
            code,
            error:{
                message:error.message,
                description:error.description,
            },
        }
    }
}


module.exports = Response;