const path = require('path');
const express = require('express');
const { create } = require('express-handlebars');

const configViewEngine = (app) => {
    const hbs = create({
        extname: '.hbs',
        layoutsDir: path.join(__dirname, '../views/layouts'),
        defaultLayout: 'Main',
    });
    app.engine('hbs', hbs.engine);
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'hbs')
    //Config static files
    app.use(express.static(path.join('./src', 'public')))
}
module.exports = configViewEngine;