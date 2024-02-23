const {validationResult} = require('express-validator');
const {PrismaClient} = require('@prisma/client');
const { UserById, CreateUser } = require('../prisma/prisma');
const prisma = new PrismaClient();
require('../prisma/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.CallbackGoogle = async(req,res,next)=>{
try{
    const {user,token} = req.user;
    let newuser = await UserByEmail(user.email);
    if(!newuser){
        newuser = await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                accessToken:accessToken
            }
        })
    }
    res.status(200).json({
        message:'Signed In',
        token:token
    })
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}


exports.SingUp = async(req,res,next)=>{
try{
    const {name,email} = req.body
    let password = req.body.password;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('validation failed.')
        error.statusCode = 422;
        error.data = errors.array()
        throw error
    }
    if(await UserByEmail(email)){
        const error = new Error('user with this email already exist.');
        error.statusCode = 409;
        throw error;
    }
    password = await bcrypt.hash(password,12);
    const user = await CreateUser(name,email,password);
    res.status(201).json({
        message:'Signed Up',
        user:user.id
    })
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

exports.LogIn = async(req,res,next)=>{
try{
    const {email,password} = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('validation failed.')
        error.statusCode = 422;
        error.data = errors.array()
        throw error
    };
    const user = await UserByEmail(email)
    if(!user){
        const error = new Error('User doesnt exist with current email.');
        error.statusCode = 404;
        throw error;
    }
    const isEqual = bcrypt.compare(password,user.password);
    if(!isEqual){
        const error = new Error('Password Doesnt match.');
        error.statusCode = 409;
        throw error;
    };
    const token = jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.status(200).json({
        message:'Loged in',
        token:token
    })
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

exports.Logout = async(req,res,next)=>{
    
}