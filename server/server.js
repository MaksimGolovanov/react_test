require('dotenv').config()
const express = require('express');
const sequelize = require('./db')
const models = require('./models/models')
const cars = require('./models/carModels')
const iususer = require('./models/IusPtModels')
const cors = require('cors')
const route = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use('/api',route)



const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
     
        
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();     