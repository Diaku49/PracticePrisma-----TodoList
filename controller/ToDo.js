const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
require('../prisma/prisma');
const {validationResult} = require('express-validator');
const { HandleImage } = require('../prisma/prisma');
require('path')




exports.GetUserToDo = async(req,res,next)=>{
    const email = req.email;
try{
    //pagination
    const totalTodosCount = await prisma.tdl.count({
        where: { user: { email: email } },
    });
    const pageSize = parseInt(req.query.pageSize,10) || 8;
    const page = Math.ceil(totalTodosCount/pageSize)
    // retrieving todos
    const user = await prisma.user.findUnique({
        where:{
            email:email
        },
        include:{
            tdl:{
                skip:(page-1)*pageSize,
                take:pageSize,
            }
        }
    });
    //respond
    res.status(200).json({
        Message:"todo fetched",
        user:user.tdl,
        pagination:{
            page:page,
            pageSize:pageSize
        }
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}



exports.CreateTodo = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
    };
    const Date = req.body.dueTime;
    let imagePath = '';
    if(req.file){
        imagePath = req.file.path;
    }
    const todo = await prisma.toDo.create({
        data:{
            title:req.body.title,
            dueTime:Date,
            image:imagePath
        }
    });
    res.status(201).json({
        message:"todo created.",
        todo:todo
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}


exports.EditTodo = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    };
    const todoId = req.params.todoId;
    const isUser = await prisma.user.findUnique({
        where:{
            email:req.email,
            tdl:{
                some:{
                    id:todoId
                }
            }
        }
    });
    if(!isUser){
        const error = new Error('not allowed.');
        error.statusCode = 403;
        throw error;
    }
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
        message:"Todo Edited.",
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


exports.DeleteTodo = async(req,res,next)=>{
try{
    const todoId = req.params.todoId;
    //checking user
    const isUser = await prisma.user.findUnique({
        where:{
            email:req.email,
            tdl:{
                some:{
                    id:todoId
                }
            }
        }
    });
    if(!isUser){
        const error = new Error('not allowed.');
        error.statusCode = 403;
        throw error;
    };
    await prisma.toDo.delete({
        where:{
            id:todoId
        }
    })
    res.status(200).json({
        message:'Deleted.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}




