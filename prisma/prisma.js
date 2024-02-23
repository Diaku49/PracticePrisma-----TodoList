const {PrismaClient} = require('@prisma/client');
const ClearImage = require('../util/ClearImage');
const prisma = new PrismaClient();

// auth
exports.UserByEmail = async(Email)=>{
try{
    return await prisma.user.findUnique({
        where:{email:Email}
    })
}
catch(err){
    throw new Error('Error retrieving user.');
}
}


exports.AccessToken = async(Email,accessToken)=>{
try{
    await prisma.user.update({
        where:{email:Email},
        data:{accessToken:accessToken}
    })
}
catch(err){
    throw new Error('Error retrieving user.');
}
}

exports.CreateUser = async(name,email,password)=>{
try{
    const newuser = await prisma.user.create({
        data:{
            name:name,
            email:email,
            password:password
        }
    })
    return newuser
}
catch(err){
    throw new Error('Error retrieving user.');
}
}

// Image handling

exports.HandleImage = async(filepath,TodoId)=>{
    const todo = await prisma.toDo.findFirst({
        where:{
            id:TodoId,
            image:''
        }
    });
    if(!todo){
        await ClearImage(filepath);
        return filepath;
    }
    return '';
}