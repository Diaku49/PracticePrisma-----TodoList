const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


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