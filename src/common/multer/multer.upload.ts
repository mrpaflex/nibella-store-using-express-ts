// import { NextFunction, Request } from 'express';
// import multer from 'multer';
// import path from 'path';


//  export const multerUpload = multer({
   
//     storage: multer.diskStorage({}),
//     fileFilter(req, file, next) {
//         console.log('uploading file')
//         const filename = file.originalname;
//         const spiltname = filename.split('.');
//         const random = Math.round(Math.random() * 100);
//         const newFileName = `${spiltname[0]}_${random}.${spiltname[1]}`;

//         const ext = path.extname(newFileName).toLowerCase();
        
//             if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//             return false;
//               }
//               return true;
//     },
    
// })


import { NextFunction, Request } from 'express';
import multer from 'multer';
import path from 'path';

export const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter(req, file, next) {
    const filename = file.originalname;
    const spiltname = filename.split('.');
    const random = Math.round(Math.random() * 100);
    const newFileName = `${spiltname[0]}_${random}.${spiltname[1]}`;

    const ext = path.extname(newFileName).toLowerCase();

    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
  
     return next(new Error('Only JPG, JPEG, and PNG files are allowed.'));
    }
    
   return next(null, true);
  },
});
