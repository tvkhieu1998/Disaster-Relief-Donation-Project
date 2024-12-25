const db = require('../models/index');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));


const registerService = ({ cccd, name, email, password, phoneNumber, roleId, age, address }) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.User.findOrCreate({
            where: {
                [Op.or]: [
                    { email },
                    { cccd },
                    { phoneNumber }
                ]
            },
            defaults: {
                cccd,
                name,
                email,
                password: hashPassword(password),
                phoneNumber,
                roleId,
                age,
                address
            }
        },)

        const token = response[1] ? jwt.sign(
            {
                cccd: response[0].cccd,
                email: response[0].email,
                roleId: response[0].roleId
            }
            , process.env.SERVER_JSWTOKEN
            , { expiresIn: '5d' }) : null;
        resolve({
            error: response[1] ? 0 : 1,
            message: response[1] ? 'Register successfully' : 'Email, CCCD or PhoneNumber is already used',
            token
        });
    } catch (error) {
        reject(error)
        console.log(error)
    }
})

const loginService = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true
        })
        if (!response) {
            return resolve({
                error: 1,
                message: 'Sai email'
            });
        }


        if (response.isActive === false) {
            return resolve({
                error: 1,
                message: 'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với quản trị viên để được giải quyết.'
            });
        }

        const isChecked = response && bcrypt.compareSync(password, response.password)
        const token = isChecked ? jwt.sign(
            {
                cccd: response.cccd,
                email: response.email,
                roleId: response.roleId
            }
            , process.env.SERVER_JSWTOKEN
            , { expiresIn: '5d' }) : null;
        resolve({
            error: token ? 0 : 1,
            message: token ? 'Đã đăng nhập thành công.' : response ? 'Sai password' : 'Sai email',
            Access_Token: token,
            cccd: isChecked ? response.cccd : null,
            email: isChecked ? response.email : null,
            roleId: isChecked ? response.roleId : null
        });
    } catch (error) {
        reject(error)
        console.log(error)
    }
})





module.exports = { registerService, loginService }