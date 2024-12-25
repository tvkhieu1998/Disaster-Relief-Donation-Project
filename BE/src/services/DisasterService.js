'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

//CRUD:
//get all disasters
const getAllDisasters = async () => {
    try {
        const disasters = await models.Disaster.findAll({
            where: {
                disasterId: {
                    [Op.ne]: null   // Lấy tất cả các bản ghi có disasterId khác null}
                }
            }
        });
        return {
            error: 0,
            message: "Get all disaster successfully",
            data: disasters
        }

    } catch (error) {
        return {
            error: 1,
            message: 'Error fetching data'
        }
    }
};

//get a disaster by keyword: disasterId
const getDisasterByKeyWord = async (keyword, pageIndex) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;
        const whereCondition = keyword
            ? {
                [Op.or]: [
                    { disasterId: { [Op.like]: `%${keyword}%` } },
                ]
            }
            : {};

        const disasters = await models.Disaster.findAll({
            where: whereCondition,
            limit: pageLimit,
            offset: offset,
        });

        return {
            error: 0,
            message: 'Get all disasters successfully',
            disasters: disasters,
            CurrentPage: pageIndex
        };
    } catch (error) {
        return {
            error: 1,
            message: 'Error fetching disasters data.'
        }
    }
};

//create a new disaster
const createDisaster = async (data) => {
    try {
        const { disasterId, description } = data;

        //check if disasterId or description is null
        if (!disasterId || !description) {
            return {
                error: 1,
                message: 'disasterId, description are required',
                data: null
            }
        }

        //check if disasterId or description is invalid
        if (typeof disasterId !== 'string' || typeof description !== 'string') {
            return {
                error: 1,
                message: 'All field must be string',
                data: null
            }
        }

        //create a new disaster
        const newDisaster = await models.Disaster.create({
            disasterId: disasterId,
            description: description
        });

        return {
            error: 0,
            message: 'Create a new disaster successfully',
            data: newDisaster
        }

    } catch (error) {
        console.log("Error create a new disaster: ", error);
        return {
            error: 1,
            message: 'Error create a new disaster.'
        }
    }
};

//update a disaster by keyword: disasterId
const updateDisasterByKeyWord = async (data) => {
    try {
        const { disasterId, description } = data;

        //check if disasterId or description is null
        if (!description) {
            return {
                error: 1,
                message: 'Description are required',
                data: null
            }
        }

        //check if disasterId or description is invalid
        if (typeof disasterId !== 'string' || typeof description !== 'string') {
            return {
                error: 1,
                message: 'All field must be string',
                data: null
            }
        }

        //update a disaster
        const [disaster] = await models.Disaster.update({
            description: description
        }, {
            where: {
                disasterId: disasterId
            }
        });

        //check if disaster is not updated
        if (disaster === 0) {
            return {
                error: 1,
                message: 'Disaster is not updated',
                data: null
            }
        }
        const updatedDisaster = await models.Disaster.findOne({
            where: {
                disasterId: disasterId
            }
        });

        return {
            error: 0,
            message: 'Update a disaster successfully',
            data: updatedDisaster
        }

    } catch (error) {
        console.log("Error update a disaster: ", error);
        return {
            error: 1,
            message: "Error update a disaster"
        }
    }
};

//delete a disaster by keyword: disasterId
const deleteDisasterByKeyWord = async (data) => {
    try {
        const { disasterId } = data;

        //delete a disaster
        const deletedDisaster = await models.Disaster.destroy({
            where: {
                disasterId: disasterId
            }
        });

        //check if disaster is not deleted
        if (deletedDisaster === 0) {
            return {
                error: 1,
                message: 'Disaster is not deleted',
                data: null
            }
        }

        return {
            error: 0,
            message: 'Delete a disaster successfully',
            data: deletedDisaster
        }

    } catch (error) {
        console.log("Error delete a disaster: ", error);
        return {
            error: 1,
            message: "Error delete a disaster"
        }
    }
};

module.exports = {
    getAllDisasters,
    getDisasterByKeyWord,
    createDisaster,
    updateDisasterByKeyWord,
    deleteDisasterByKeyWord
};