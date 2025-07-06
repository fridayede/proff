

import multer from "multer"

const storage = multer.memoryStorage();

const fileFilter =(req,file,cb) =>{
if (file.mimeType.startWith("image/")){
    cb(null,true);
}else{
    cb(new Error("only image files are allowed"),false);
}
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fieldSize:5*1024*1024}  //5mb limit
})

export default upload;