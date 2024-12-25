require('dotenv').config();

module.exports = {
  development: {
    username: process.env.SERVER_HOST_DB_USER,
    password: process.env.SERVER_HOST_DB_PASSWORD,
    database: process.env.SERVER_HOST_DB_NAME,
    host: process.env.DB_HOST_URL,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    },
    logging: false,
    timezone: '+07:00'
  },
  test: {
    username: process.env.SERVER_HOST_DB_USER,
    password: process.env.SERVER_HOST_DB_PASSWORD,
    database: process.env.SERVER_HOST_DB_NAME,
    host: process.env.DB_HOST_URL,
    dialect: 'mssql',
    logging: false,
    timezone: '+07:00'
  },
  production: {
    username: process.env.SERVER_HOST_DB_USER,
    password: process.env.SERVER_HOST_DB_PASSWORD,
    database: process.env.SERVER_HOST_DB_NAME,
    host: process.env.DB_HOST_URL,
    dialect: 'mssql',
    logging: false,
    timezone: '+07:00'
  }
};
