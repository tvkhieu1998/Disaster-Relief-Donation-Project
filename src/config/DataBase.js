require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.SERVER_HOST_DB_NAME, process.env.SERVER_HOST_DB_USER, process.env.SERVER_HOST_DB_PASSWORD, {
    host: process.env.DB_HOST_URL,
    dialect: 'mssql',
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    },
    dialectOptions: {
        encrypt: true,
        trustServerCertificate: true
    }
});
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connection has been established successfully. Server name is: ${process.env.DB_HOST_URL}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();
module.exports = sequelize;