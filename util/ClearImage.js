const fs = require('fs');

const clearImage = async (filePath)=>{
try{
    await fs.promises.unlink(filePath)
}
catch(err){
    err.statusCode = 500;
    throw err;
}
}

module.exports = clearImage;