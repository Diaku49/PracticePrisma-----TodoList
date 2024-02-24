const express = require('express');
require('dotenv');
const compression = require('compression');
const multer = require('multer');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path')




const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'/images'))
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        cb(null,file.fieldname + '-' + Date.now() + ext);
    }
});

const fileFilter = (req,file,cb)=>{
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};



const AuthRouter = require('./routes/auth');
const ToDoRouter = require('./routes/ToDo');
const UARouter = require('./routes/User&Admin');




const app = express();

app.use(helmet());
app.use(compression({threshold:'2kb'}));
app.use(bodyParser.json());
app.use(multer({storage:Storage,fileFilter:fileFilter}).single('Image'));

app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','PUT,GET,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Origin Content-Type,Accept,Athorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})



app.use('/auth',AuthRouter);
app.use('/ToDo',ToDoRouter);
app.use('/UA',UARouter);







app.use((error,req,res,next)=>{
    console.log(error);
    const errorStatusCode = error.statusCode || 500;
    const errorData = error.data;
    const message = error.message;
    res.sendStatus(errorStatusCode).json({
        message:message,data:errorData
    })
})


app.listen(process.env.PORT)