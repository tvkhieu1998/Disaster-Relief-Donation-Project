const db = require('../models/index');
const { Op } = require("sequelize");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
//CRUD:
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));

const getAccountsService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;
        const age = parseInt(search_keyword, 10);
        const ageCondition = !isNaN(age) && age >= -32768 && age <= 32767 ? age : undefined;
        if (ageCondition === undefined) {
            const searchConditions = search_keyword
                ? {
                    [Op.or]: [
                        { cccd: { [Op.like]: `%${search_keyword}%` } },
                        { name: { [Op.like]: `%${search_keyword}%` } },
                        { email: { [Op.like]: `%${search_keyword}%` } },
                        { phoneNumber: { [Op.like]: `%${search_keyword}%` } },
                        { address: { [Op.like]: `%${search_keyword}%` } }
                    ]
                }
                : {};

            const response = await db.User.findAll({
                where: searchConditions,
                limit: pageLimit,
                offset: offset,
            })
            resolve({
                error: 0,
                message: 'Get successfully',
                UserData: response,
                CurrentPage: pageIndex
            });
        }
        else {
            const response = await db.User.findOne({
                where: {
                    age: ageCondition
                },
            })
            resolve({
                error: 0,
                message: 'Get successfully',
                UserData: response
            });
        }
    } catch (error) {
        return {
            error: 1,
            message: 'Error fetching data',
            details: error
        }
    }
})


const getAccountService = (search_keyword) => new Promise(async (resolve, reject) => {
    try {
        if (!search_keyword) {
            return resolve({
                error: 1,
                message: 'Search keyword is required',
                UserData: null
            });
        }
        const age = parseInt(search_keyword, 10);
        const ageCondition = !isNaN(age) && age >= -32768 && age <= 32767 ? age : undefined;

        if (ageCondition === undefined) {
            const response = await db.User.findAll({
                where: {
                    [Op.or]: [
                        { cccd: search_keyword },
                        { name: search_keyword },
                        { email: search_keyword },
                        { phoneNumber: search_keyword },
                        { address: search_keyword }
                    ],
                },
                include: [{
                    model: db.Role,
                    as: 'Role',
                    attributes: ['value'],
                }],
            })
            resolve({
                error: response ? 0 : 1,
                message: response ? 'Get successfully' : 'User not found',
                UserData: response,
            });
        }
        else {
            const response = await db.User.findOne({
                where: {
                    age: ageCondition
                },
                include: [{
                    model: db.Role,
                    as: 'Role',
                    attributes: ['value'],
                }],
            })
            resolve({
                error: response ? 0 : 1,
                message: response ? 'Get successfully' : 'User not found',
                UserData: response
            });
        }
    } catch (error) {
        reject(error)
    }
})

const createAccountService = ({ cccd, name, email, password, phoneNumber, roleId, age, address }) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.User.findOne({
            where: {
                [Op.or]: [
                    { cccd: cccd },
                    { phoneNumber: phoneNumber },
                    { email: email },
                ]
            },

        })
        if (existingUser) {
            resolve({
                err: 1,
                message: 'Account with this CCCD, phone number, or email already exists',
            });
        } else {
            const newUser = await db.User.create({
                cccd,
                name,
                email,
                password: hashPassword(password),
                phoneNumber,
                roleId,
                age,
                address,
            });
            const token = newUser ? jwt.sign(
                {
                    cccd: newUser.cccd,
                    email: newUser.email,
                    roleId: newUser.roleId
                },
                process.env.SERVER_JSWTOKEN,
                { expiresIn: '2d' }
            ) : null;
            resolve({
                error: newUser ? 0 : 1,
                message: newUser ? 'Create new Account successfully' : 'Email, CCCD or PhoneNumber is already used',
                token
            });
        }
    } catch (error) {
        reject(error);
    }
})
const updateAccountService = ({ cccd, name, email, password, phoneNumber, roleId, age, address, isActive }) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                ]
            }
        });
        if (!existingUser) {
            return resolve({
                error: 1,
                message: "Account does not exist!",
            })
        }

        existingUser.cccd = cccd || existingUser.cccd;
        existingUser.name = name || existingUser.name;
        existingUser.password = password ? hashPassword(password) : existingUser.password;
        existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
        existingUser.roleId = roleId || existingUser.roleId;
        existingUser.age = age || existingUser.age;
        existingUser.address = address || existingUser.address;
        existingUser.isActive = isActive ?? existingUser.isActive;
        //save update
        await existingUser.save();
        resolve({
            error: 0,
            message: 'Update Account Successfully!',
            UserData: existingUser
        });
    } catch (error) {
        reject(
            {
                error: 1,
                message: error,
            }
        )
    }
})

const deleteAccountService = ({ cccd, confirmation }) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.User.findOne({
            where: {
                [Op.or]: [
                    { cccd: cccd },
                ]
            }
        });
        if (!existingUser) {
            return resolve({
                error: 1,
                message: "Account does not exist!",
            })
        }
        if (!confirmation) {
            return resolve({
                error: 1,
                message: "Please confirm deletion by setting confirmation: true!",
            })
        }
        await existingUser.destroy();
        resolve({
            error: 0,
            message: 'The account has been deleted!',
        })
    } catch (error) {
        reject(error);
    }
})
module.exports = {
    getAccountsService, getAccountService, updateAccountService, deleteAccountService, createAccountService
};