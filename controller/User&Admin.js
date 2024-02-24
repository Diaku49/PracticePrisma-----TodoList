const {PrismaClient} = require('@prisma/client');
const { emit } = require('nodemon');
const prisma = new PrismaClient()
require('../prisma/prisma');
const {validationResult} = require('express-validator');
const { HandleImage, UserByEmail } = require('../prisma/prisma');
require('path')
const bcrypt = require('bcrypt');


exports.getUserP = async(req,res,next)=>{
    const user = await UserByEmail(req.email)
    res.status(200).json({
        message:'user',
        user:user
    })
};

exports.getAllUsers = async(req,res,next)=>{
try{
    const users = await prisma.user.findMany({
        include:{
            tdl:true
        }
    });
    res.status(200).json({
        message:'users fetched.',
        users:users
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.editProfile = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const userEmail = req.email;
    const { email,name,password } = req.body;
    const Password =  bcrypt.hashSync(password,12);
    const newUser = await prisma.user.update({
        where:{
            email:userEmail
        },
        data:{
            email:email,
            name:name,
            password:Password
        },
        include:{
            tdl:true
        }
    })
    res.status(200).json({
        message:'updated',
        newuser:newUser
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.editUserProfile = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    };
    const userId = req.params.userId;
    const {email,password,name,roll} = req.body;
    if(role !== 'USER' || roll !== 'ADMIN'){
        const error = new Error('not valid roll');
        error.statusCode = 400;
        throw error;
    }
    const Password =  bcrypt.hashSync(password,12);
    const newuser = prisma.user.update({
        where:{
            id:userId
        },
        data:{
            email:email,
            name:name,
            password:Password,
            role:role
        }
    });
    res.status(200).josn({
        message:'User Updated by Admin',
        newuser:newuser
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.editUserTodo = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    };
    const todoId = req.params.todoId;
    let imagePath = ''
    if(req.file){
        imagePath = await HandleImage(req.file.path,todoId);
    }
    const todo = await prisma.toDo.update({
        where:{
            id:todoId
        },
        data:{
            title:req.body.title,
            dueTime:req.body.dueTime,
            image:imagePath
        }
    });
    res.status(201).json({
        message:"Todo Edited by Admin.",
        todo:todo
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.DeleteUser = async(req,res,next)=>{
try{
    const userId = req.params.userId;
    prisma.user.delete({
        where:{
            id:userId
        }
    });
    res.status(200).json({
        message:'User deleted by Admin.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.DeleteUserTodo = async(req,res,next)=>{
try{
    const todoId = req.params.todoId;
    prisma.toDo.delete({
        where:{
            id:todoId
        }
    });
    res.status(200).json({
        message:'Todo deleted by Admin.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}