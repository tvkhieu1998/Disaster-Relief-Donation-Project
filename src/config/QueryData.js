const express = require('express');

const configQueryData = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}
module.exports = configQueryData;
