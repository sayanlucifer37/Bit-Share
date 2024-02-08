// kakw vytc cmkr awhq
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes')
const fileShareRoutes = require('./routes/fileShareRoutes');
const dotenv = require('dotenv');
dotenv.config();


require('./db');
require('./models/userModel');
require('./models/verificationModel');



const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);


app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));



// Share the io instance with fileShareRoutes
app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use('/auth', authRoutes);
app.use('/file', fileShareRoutes);


app.get('/', (req, res) => {
    res.send('API is running....');
});


server.listen(8000, () => {
    console.log('Server started!');
});
