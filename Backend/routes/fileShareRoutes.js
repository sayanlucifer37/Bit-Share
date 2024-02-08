const express = require('express');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const nodemailer = require('nodemailer');
const responseFunction = require('../utils/responseFunction');
const fs = require('fs');
const errorHandler = require('../middlewares/errorMiddleware');
const authTokenHandler = require('../middlewares/checkAuthToken');


async function mailer(recieveremail, filesenderemail) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        requireTLS: true,
        auth: {
            user : "virajj014@gmail.com",
            pass : "kakw vytc cmkr awhq"
        }
    })

    let info =  await transporter.sendMail({
        from : "Team BitS",
        to : recieveremail,
        subject: "new file",
        text: "You recieved a new file from " + filesenderemail,
        html: "<b>You recieved a new file from  " + filesenderemail + "</b>",

    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/')[1];
        console.log(req.headers.filename);
        cb(null, `${Date.now()}.${fileType}`);
    }
});
const upload = multer({ storage: storage });

const fileUploadFunction = (req, res, next) => {

    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            return responseFunction(res, 400, 'File upload failed', null, false);
        }
        next();
    })
}

router.get('/test', (req, res) => {
    res.send('File share routes are working!');
});

router.post('/sharefile', authTokenHandler, fileUploadFunction, async (req, res, next) => {
    try {
        const {  receiveremail, filename } = req.body;
        // console.log(req.body);
        let senderuser = await User.findOne({ _id : req.userId });
        let recieveruser = await User.findOne({ email: receiveremail });
        if (!senderuser) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            return responseFunction(res, 400, 'Sender email is not registered', null, false);
        }
        if (!recieveruser) {

            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            
            return responseFunction(res, 400, 'Reciever email is not registered', null, false);
        }


        if(senderuser.email === receiveremail){
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            
            return responseFunction(res, 400, 'Reciever email cannot be same as sender', null, false);
        }

        senderuser.files.push({
            senderemail: senderuser.email,
            receiveremail: receiveremail,
            fileurl: req.file.path,
            filename: filename?filename : new Date().toLocaleDateString(),
            sharedAt: Date.now()
        })

        recieveruser.files.push({
            senderemail: senderuser.email,
            receiveremail: receiveremail,
            fileurl: req.file.path,
            filename: filename?filename : new Date().toLocaleDateString(),
            sharedAt: Date.now()
        })

        await senderuser.save();
        await recieveruser.save();
        await mailer(receiveremail, senderuser.email);
        return responseFunction(res, 200, 'shared successfully', null, true);

    }
    catch(err){
        next(err);
    }
})


router.use(errorHandler)

module.exports = router;
