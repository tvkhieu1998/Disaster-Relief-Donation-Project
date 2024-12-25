'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

//get all charity organizations
const getAllCharityOrg = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        let isVerifyCondition = undefined;
        if (search_keyword === 'true' || search_keyword === 'false') {
            isVerifyCondition = search_keyword === 'true';
        }
        const searchConditions = isVerifyCondition !== undefined
            ? { isVerify: isVerifyCondition }
            : search_keyword
                ? {
                    [Op.or]: [
                        { orgId: { [Op.like]: `%${search_keyword}%` } },
                        { cccd: { [Op.like]: `%${search_keyword}%` } }
                    ]
                }
                : {};


        const response = await models.CharityOrganization.findAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
        });
        resolve({
            error: 0,
            message: 'Get successfully',
            OrgData: response,
            CurrentPage: pageIndex
        });
    } catch (error) {
        console.log('error ', error);
        reject({
            error: 1,
            message: 'Error fetching data',
            details: error
        });
    }
});


//get a charity organization by keyword: orgId or orgname
const getCharityOrdByKeyword = async (keyword) => {
    try {
        if (!keyword) {
            throw new Error({
                error: 1,
                message: 'Keyword is required',
                data: null
            });
        }

        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                [Op.or]: [
                    { orgId: keyword },
                    { orgname: keyword },
                    { cccd: keyword },
                ]
            }
        });
        return {
            error: 0,
            message: 'Get CharityOrg successfully',
            orgData: charityOrg
        };
    } catch (error) {
        console.log("Error fetching data get charity by keyword: ", error);
        return {
            error: 1,
            message: error
        }
    }
}

//create a new charity organization
const createCharityOrg = async (data) => {
    try {
        const { orgId, orgname, contractInfo, license, isVerify, cccd } = data;
        //check if orgId or orgname is already existed
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                [Op.or]: [
                    { orgId: orgId },
                    { orgname: orgname },
                ],
            },
        });
        if (charityOrg) {
            return {
                error: 1,
                message: 'Charity Organization is already existed',
                data: null
            }
        }

        // check if orgId or orgname or contractInfo or license is null
        if (!orgId || !orgname || !contractInfo || !license) {
            return {
                error: 1,
                message: 'orgId, orgname, contractInfo, license are required',
                data: null
            }
        }

        if (typeof orgId !== 'string' || typeof orgname !== 'string' || typeof contractInfo !== 'string' || typeof license !== 'string') {
            return {
                error: 1,
                message: 'Invalid data types. All fields must be strings.',
                data: null
            }
        }

        // create a new charity organization
        const newCharityOrg = await models.CharityOrganization.create({
            orgId: orgId,
            orgname: orgname,
            contractInfo: contractInfo,
            license: license,
            isVerify: isVerify,
            cccd: cccd,
        });

        return {
            error: 0,
            message: 'Create successfully',
            data: newCharityOrg
        }

    } catch (error) {
        console.log("Error fetching data to create: ", error);
        return {
            error: 1,
            message: error
        }
    }
};

//update a charity organization
const updateCharity = async (data) => {
    try {
        // check if data is null
        const { orgId, orgname, contractInfo, license, isVerify, cccd } = data;

        if (!orgId || !orgname || !contractInfo || !license) {
            return {
                error: 1,
                message: 'orgId, orgname, contractInfo, license are required',
                data: null
            }
        }

        // check if data is invalid
        if (typeof orgId !== 'string' || typeof orgname !== 'string' || typeof contractInfo !== 'string' || typeof license !== 'string') {
            return {
                error: 1,
                message: 'Invalid data types. All fields must be strings.',
                data: null
            }
        }

        if (isVerify === "true" || isVerify === "false") {
            const existingUser = await models.User.findOne({
                where: { cccd: cccd }
            });

            if (existingUser) {
                if (isVerify === "true" && existingUser.roleId !== 3) {
                    existingUser.roleId = 3;
                    await existingUser.save();
                } else if (isVerify === "false" && existingUser.roleId !== 2) {
                    existingUser.roleId = 2;
                    await existingUser.save();
                }
            }
        }

        // update a charity organization
        const [charityOrg] = await models.CharityOrganization.update({
            orgId: orgId,
            orgname: orgname,
            contractInfo: contractInfo,
            license: license,
            isVerify: isVerify,
            cccd: cccd,
        }, {
            where: {
                [Op.or]: [
                    { orgId: orgId },
                    { orgname: orgname },
                ],
            }
        });

        // check if charity organization is not updated
        if (charityOrg === 0) {
            return {
                error: 1,
                message: 'No Charity Organization was updated.',
                data: null
            };
        }

        const chairtyOrgUpdated = await models.CharityOrganization.findOne({
            where: {
                [Op.or]: [
                    { orgId: orgId },
                    { orgname: orgname },
                ],
            }
        });

        return {
            error: 0,
            message: 'Update successfully',
            // data: charityOrg
            data: chairtyOrgUpdated
        }

    } catch (error) {
        console.log("Error while updating charity organization:", error);
        return {
            error: 1,
            message: 'An error occurred while updating the Charity Organization.',
            data: error.message
        };
    }
};
//delete a charity organization
const deleteCharityOrg = async (data) => {
    try {
        const { orgId } = data;

        const existingCharityOrg = await models.CharityOrganization.findOne({
            where: {
                [Op.or]: [
                    { orgId: orgId }
                ],
            }
        });

        if (existingCharityOrg) {
            console.log('thấy nè');
            if (existingCharityOrg.cccd) {
                const existingUser = await models.User.findOne({
                    where: { cccd: existingCharityOrg.cccd }
                });

                if (existingUser) {
                    if (existingUser.roleId === 3) {
                        existingUser.roleId = 2;
                        await existingUser.save();
                    }
                }
            }
        }

        // delete a charity organization
        const charityOrg = await models.CharityOrganization.destroy({
            where: {
                [Op.or]: [
                    { orgId: orgId }
                ],
            }
        });

        // check if charity organization is not deleted
        if (charityOrg === 0) {
            return {
                error: 1,
                message: 'No Charity Organization was deleted.',
                data: null
            };
        }

        return {
            error: 0,
            message: 'Delete successfully',
            data: charityOrg
        }

    } catch (error) {
        console.log("Error while deleting charity organization:", error);
        return {
            error: 1,
            message: 'An error occurred while deleting the Charity Organization.',
            data: error.message
        };
    }
};

module.exports = { getAllCharityOrg, getCharityOrdByKeyword, createCharityOrg, updateCharity, deleteCharityOrg, };