const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const { UserByEmail } = require('../prisma/prisma');
const prisma = new PrismaClient();

const IsAdmin = async(req,res,next)=>{
try{
    const auth = req.get('Athorization');
    if(!auth){
        const error = new Error('not Athenticated.');
        error.statusCode = 401;
        throw error;
    };
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    if(!decodedToken){
        const error = new Error('token not valid.');
        error.statusCode = 403;
        throw error;
    }
    const user = await UserByEmail(decodedToken.email);
    if(!user || !user.accessToken || user.role === 'USER' ){
        const error = new Error('Couldnt find user/No AccessToken/Not an Admin.');
        error.statusCode = 404;
        throw error;
    };
    req.userId = user.id
    req.email = user.email;
    next()
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

const IsAuth = async(req,res,next)=>{
try{
    const auth = req.get('Athorization');
    if(!auth){
        const error = new Error('not Athenticated.');
        error.statusCode = 401;
        throw error;
    };
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    if(!decodedToken){
        const error = new Error('token not valid.');
        error.statusCode = 403;
        throw error;
    }
    const user = await UserByEmail(decodedToken.email);
    if(!user || !user.accessToken){
        const error = new Error('Couldnt find user/No AccessToken.');
        error.statusCode = 404;
        throw error;
    };
    req.email = user.email;
    req.userId = user.id
    next()
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

module.exports = {IsAdmin,IsAuth};