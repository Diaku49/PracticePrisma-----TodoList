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













app.listen(process.env.PORT)