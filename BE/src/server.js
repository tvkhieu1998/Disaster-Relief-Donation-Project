require('dotenv').config()
const express = require('express')
const cors = require('cors');
const configViewEngine = require('./config/ViewEngine');
require('./config/DataBase');

const webRouters = require('./routes/web');
const apiRouters = require('./routes/api');
const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.SERVER_HOST_NAME || '0.0.0.0'

//Config:
configViewEngine(app);
const corsOptions = {
    origin: ['https://da-disaster-relief-fe-2499b0120156.herokuapp.com', 'http://localhost:63342'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Route:
app.use('/', webRouters);
app.use('/api', apiRouters);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`Ctrl + click to open http://localhost:${port}/`)
})

// create table qua model
// sequelize cli

module.exports = app;