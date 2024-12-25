'use strict';

const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;


const getLatestReportService = async () => {
    try {
        const report = await models.Report.findOne({
            where: {
                orgId: {
                    [Op.ne]: null
                }
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            limit: 1
        });

        if (report) {
            return {
                error: 0,
                message: 'Get latest and lightest report successfully',
                LatestTime: report.updatedAt
            };
        } else {
            return {
                error: 1,
                message: 'No report found',
            };
        }
    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            error: 1,
            message: 'Error fetching data'
        };
    }
};

const getReportStatisticService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await models.Report.findAll();
        resolve({
            error: 0,
            message: 'Lấy tất cả report thành công',
            Reports: response
        });
    } catch (error) {
        console.error('Error in getReportStatisticService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách report'
        });
    }
});

//get all reports
const getAllReports = async () => {
    try {
        const reports = await models.Report.findAll({
            where: {
                orgId: {
                    [Op.ne]: null
                }
            }
        });
        return {
            error: 0,
            message: 'Get all reports successfully',
            data: reports
        };
    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            error: 1,
            message: 'Error fetching data'
        }
    }
};


//get a report by keyword: orgId or cccdAmin
const getReportsService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        const searchConditions = search_keyword
            ? {
                [Op.or]: [
                    { orgId: { [Op.like]: `%${search_keyword}%` } },
                    { cccdAmin: { [Op.like]: `%${search_keyword}%` } }
                ]
            }
            : {};

        const response = await models.Report.findAndCountAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
            order: [['createdAt', 'ASC']],
        });

        resolve({
            error: 0,
            message: 'Lấy danh sách report thành công',
            Reports: response.rows,
            CurrentPage: pageIndex
        });
    } catch (error) {
        console.error('Error in getAllFeedbackService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách report'
        });
    }
});

//create a new report
const createNewReport = async (data) => {
    try {
        const { orgId, cccdAmin, remaining, damages, budget, comment } = data;

        // Check if orgId is not existed on CharityOrganization table
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                orgId: orgId
            }
        });
        if (!charityOrg) {
            return {
                error: 1,
                message: 'orgId on CharityOrganization table is not existed.'
            }
        }

        // Check if cccdAdmin is not existed
        const user_cccd = await models.User.findOne({
            where: {
                cccd: cccdAmin
            }
        });

        if (!user_cccd) {
            return {
                error: 1,
                message: 'cccdAdmin on User table is not existed.'
            }
        }

        //create a new report
        const report = await models.Report.create({
            orgId: orgId,
            cccdAmin: cccdAmin,
            remaining: remaining,
            damages: damages,
            budget: budget,
            comment: comment
        });
        return {
            error: 0,
            message: 'Create report successfully',
            data: report
        }
    } catch (error) {
        console.log("Error creating report: ", error);
        return {
            error: 1,
            message: 'Error creating report'
        }
    }
};

//update a report by orgId & cccdAmin
const updateReport = async (data) => {
    try {
        const { orgId, cccdAmin, remaining, damages, budget } = data;

        // Check if orgId is not existed on CharityOrganization table
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                orgId: orgId
            }
        });
        if (!charityOrg) {
            return {
                error: 1,
                message: 'orgId on CharityOrganization table is not existed.'
            }
        }

        // Check if cccdAdmin is not existed and roleId equal 1 (as Admin) on User table
        const user_cccd = await models.User.findOne({
            where: {
                cccd: cccdAmin,
                roleId: 1
            }
        });

        if (!user_cccd) {
            return {
                error: 1,
                message: 'cccdAdmin on User table is not existed.'
            }
        }

        // Check if orgId or cccdAdmin or remaining or damages or budget is null
        if (!remaining || !damages || !budget) {
            return {
                error: 1,
                message: 'orgId, cccdAdmin, remaining, damages, budget are required',
                data: null
            }
        }

        //check if orgId, cccdAmin, remaining, damages, budget are invalid
        if (typeof remaining !== 'number' || typeof damages !== 'number' || typeof budget !== 'number') {
            return {
                error: 1,
                message: 'orgId, cccdAdmin, remaining, damages, budget are invalid',
                data: null
            }
        }

        const report = await models.Report.update({
            remaining: remaining,
            damages: damages,
            budget: budget
        }, {
            where: {
                orgId: orgId,
                cccdAmin: cccdAmin
            }
        });

        if (report[0] === 0) {
            return {
                error: 1,
                message: 'No report was updated.',
                data: null
            }
        }

        const reportUpdated = await models.Report.findOne({
            where: {
                orgId: orgId,
                cccdAmin: cccdAmin
            }
        });

        return {
            error: 0,
            message: 'Update report successfully',
            data: reportUpdated
        }

    } catch (error) {
        console.log("Error updating report: ", error);
        return {
            error: 1,
            message: 'Error updating report.'
        }

    }
}

//delete a report by orgId & cccdAmin
const deleteReport = async (data) => {
    try {
        const { id } = data;

        const report = await models.Report.destroy({
            where: {
                id: id
            }
        });

        if (report === 0) {
            return {
                error: 1,
                message: 'No report was deleted.',
                data: null
            }
        }

        return {
            error: 0,
            message: 'Delete report successfully'
        }

    } catch (error) {
        console.log("Error deleting report: ", error);
        return {
            error: 1,
            message: 'Error deleting report.'
        }
    }
}

module.exports = {
    getLatestReportService,
    getReportStatisticService,
    getAllReports,
    getReportsService,
    createNewReport,
    updateReport,
    deleteReport
};
