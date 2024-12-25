'use strict';

const models = require('../models');
const sequelize = require('sequelize');
const {Op} = sequelize;

//get all users
const getAllUserManagement = async () => {
    try {
        const usermanagement = await models.UserManagement.findAll({
            where: {
                [Op.or]: [
                    { cccdAdmin: { [Op.ne]: null } },
                    { cccdUser: { [Op.ne]: null } },
                ]
            }
        });

        return {
            err: 0,
            message: 'Get all user management successfully',
            data: usermanagement
        }

    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            err: 1,
            message: 'Error fetching data'
        }
    }
};

//get a user by keyword: cccdAdmin or cccdUser
const getUserManagementByKeyword = async (keyword) => {
    try {
        if (!keyword) {
            return {
                err: 1,
                message: 'Keyword is required',
                data: null
            };
        }

        const usermanagement = await models.UserManagement.findAll({
            where: {
                [Op.or]: [
                    { cccdAdmin: keyword },
                    { cccdUser: keyword }
                ]
            }
        });

        return usermanagement;
    } catch (error) {
        console.log("Error fetching data get a user by keyword: ", error);
        return {
            err: 1,
            message: 'Error fetching data get a user by keyword',
            data: null
        }
    }
};

//create a new user management
const createUserManagement = async (data) => {
    try {
        const { cccdAdmin, cccdUser, verifyStatus } = data;

        // Check if cccdAdmin is not existed and roleId equal 1 (as Admin) on User table
        const admin_cccd = await models.User.findOne({
            where: {
                cccd: cccdAdmin,
                roleId: 1
            }
        });
        if (!admin_cccd) {
            return {
                err: 1,
                message: "cccdAdmin on User table is not existed"
            }
        }
        // Check if cccdUser is not existed and roleId equal 2 (as User) on User table
        const user_cccd = await models.User.findOne({
            where: {
                cccd: cccdUser,
                roleId: 2
            }
        });
        if (!user_cccd) {
            return {
                err: 1,
                message: "cccdUser on User table is not existed"
            }
        }

        // check cccdAdmin & cccdUser are existed
        const existed = await models.UserManagement.findOne({
            where: {
                cccdAdmin: cccdAdmin,
                cccdUser: cccdUser
            }
        });
        if (existed) {
            return {
                err: 1,
                message: 'User management is already existed',
                data: existed
            }
        }

        // check if cccdAdmin or cccdUser or verifyStatus is null
        if (!cccdAdmin || !cccdUser || !verifyStatus) {
            return {
                err: 1,
                message: 'cccdAdmin, cccdUser, verifyStatus are required',
                data: null
            }
        }

        // check if cccdAdmin or cccdUser or verifyStatus is invalid
        if (typeof cccdAdmin !== 'string' || typeof cccdUser !== 'string' || typeof verifyStatus !== 'boolean') {
            return {
                err: 1,
                message: 'cccdAdmin, cccdUser must be string and verifyStatus must be boolean',
                data: null
            }
        }

        // create a new user management
        const usermanagement = await models.UserManagement.create({
            cccdAdmin: cccdAdmin,
            cccdUser: cccdUser,
            verifyStatus: verifyStatus
        });

        return {
            err: 0,
            message: 'Create user management successfully',
            data: usermanagement
        }

    } catch (error) {
        console.log("Cannot create user management: ", error);
        return {
            err: 1,
            message: 'Cannot create user management'
        }
    }
}

//update a user management
const updateUserManagement = async (data) => {
    try {
        const { cccdAdmin, cccdUser, verifyStatus } = data;

        const usermanagementExisted = await getUserManagementByKeyword(cccdAdmin || cccdUser);
        if (!usermanagementExisted) {
            return {
                err: 1,
                message: 'User management is not existed',
                data: null
            }
        }

        // Check if cccdAdmin is not existed and roleId equal 1 (as Admin) on User table
        const admin_cccd = await models.User.findOne({
            where: {
                cccd: cccdAdmin,
                roleId: 1
            }
        });
        if (!admin_cccd) {
            return {
                err: 1,
                message: "cccdAdmin on User table is not existed"
            }
        }
        // Check if cccdUser is not existed and roleId equal 2 (as User) on User table
        const user_cccd = await models.User.findOne({
            where: {
                cccd: cccdUser,
                roleId: 2
            }
        });
        if (!user_cccd) {
            return {
                err: 1,
                message: "cccdUser on User table is not existed"
            }
        }

        // check if cccdAdmin or cccdUser or verifyStatus is null
        if (!cccdAdmin || !cccdUser || !verifyStatus) {
            return {
                err: 1,
                message: 'cccdAdmin, cccdUser, verifyStatus are required',
                data: null
            }
        }

        // check if cccdAdmin or cccdUser or verifyStatus is invalid
        if (typeof cccdAdmin !== 'string' || typeof cccdUser !== 'string' || typeof verifyStatus !== 'boolean') {
            return {
                err: 1,
                message: 'cccdAdmin, cccdUser must be string and verifyStatus must be boolean',
                data: null
            }
        }

        // update a user management
        const [usermanagement] = await models.UserManagement.update({
            cccdAdmin: cccdAdmin,
            cccdUser: cccdUser,
            verifyStatus: verifyStatus
        }, {
            where: {
                // cccdAdmin: usermanagementExisted.cccdAdmin,
                // cccdUser: usermanagementExisted.cccdUser
                cccdAdmin: cccdAdmin,
                cccdUser: cccdUser
            }
        });

        if (usermanagement === 0) { 
            return {
                err: 1,
                message: 'User management is not updated',
                data: null
            }
        }

        const usermanagementUpdated = await models.UserManagement.findOne({
            where: {
                cccdAdmin: cccdAdmin,
                cccdUser: cccdUser
            }
        });

        return {
            err: 0,
            message: 'Update user management successfully',
            data: usermanagementUpdated
        }
    
    } catch (error) {
        console.log("Cannot update user management: ", error);
        return {
            err: 1,
            message: 'Cannot update user management',
            data: null
        }
    }
}

//delete a user management
const deleteUserManagement = async (data) => {
    try {
        const { cccdAdmin, cccdUser } = data;
        const existed = getUserManagementByKeyword(cccdAdmin || cccdUser);
        if (!existed) {
            return {
                err: 1,
                message: 'User management is not existed',
                data: null
            }
        }

        // delete a user management
        const deletedUserManagement = await models.UserManagement.destroy({
            where: {
                cccdAdmin: cccdAdmin,
                cccdUser: cccdUser
            }
        });

        if (deletedUserManagement === 0) {
            return {
                err: 1,
                message: "User management is not deleted",
                data: null
            }
        }

        return {
            err: 0,
            message: 'Delete user management successfully',
            data: deletedUserManagement
        }
        
    } catch (error) {
        console.log("Error deleting user management: ", error);
        return {
            err: 1,
            message: 'Error deleting user management'
        }
    }
}

module.exports = {
    getAllUserManagement,
    getUserManagementByKeyword,
    createUserManagement,
    updateUserManagement,
    deleteUserManagement
};
