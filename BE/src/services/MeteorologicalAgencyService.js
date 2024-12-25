'use strict'
const model = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

//get all meteorological agencies
const getAllMeteorologicalAgency = async () => {
    try {
        const meteorologicalAgencies = await model.MeteorologicalAgency.findAll({
            where: {
                agencyId: {
                    [Op.ne]: null   // Lấy tất cả các bản ghi có agencyId khác null
                }
            }
        });
        return {
            err: 0,
            message: 'Get successfully',
            data: meteorologicalAgencies
        };
    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            err: 1,
            message: 'Error fetching data'
        }
    }
};

//get a meteorological agency by keyword: agencyId or agencyName
const getMeteorologicalAgencyByKeyword = async (keyword) => {
    try {
        //check if keyword is empty
        if (!keyword) {
            return {
                err: 1,
                message: 'Keyword is required',
                data: null
            };
        }

        const meteorologicalAgency = await model.MeteorologicalAgency.findOne({
            where: {
                [Op.or]: [
                    { agencyId: keyword },
                    { name: keyword }
                ]
            }
        });

        return meteorologicalAgency;
    } catch (error) {
        console.log("Error fetching data get meteorological agency by keyword: ", error);
        return {
            err: 1,
            message: 'Error fetching data by keyword'
        }
    }
};

//create a new meteorological agency
const createMeteorologicalAgency = async (data) => {
    try {
        const { agencyId, name, dataFeed } = data;

        const existed = await model.MeteorologicalAgency.findOne({
            where: {
                [Op.or]: [
                    { agencyId: agencyId },
                    { name: name }
                ]
            }
        });

        if (existed) {
            return {
                err: 1,
                message: 'Meteorological agency is already existed',
                data: null
            }
        }

        //check if agencyId, name, dataFeed is empty
        if (!agencyId || !name || !dataFeed) {
            return {
                err: 1,
                message: 'agencyId, name, dataFeed are required',
                data: null
            }
        }

        //check if agencyId, name, dataFeed is invalid
        if (typeof agencyId !== 'string' || typeof name !== 'string' || typeof dataFeed !== 'string') {
            return {
                err: 1,
                message: 'All field must be string.',
                data: null
            }
        }

        //create a new meteorological agency
        const newMeteorologicalAgency = await model.MeteorologicalAgency.create({
            agencyId: agencyId,
            name: name,
            dataFeed: dataFeed
        });

        return {
            err: 0,
            message: 'Create successfully',
            data: newMeteorologicalAgency
        }
    } catch (error) {
        console.log("Error creating meteorological agency: ", error);
        return {
            err: 1,
            message: 'Error creating meteorological agency'
        }
    }
}

//update meteorological agency by keyword
const updateMeteorologicalAgency = async (data) => {
    try {
        const { agencyId, name, dataFeed } = data;

        //check if agencyId, name, data is empty
        if (!agencyId || !name || !dataFeed) {
            return {
                err: 1,
                message: 'agencyId, name, dataFeed are required',
                data: null
            }
        }

        //check if agencyId, name, data is invalid
        if (typeof agencyId !== 'string' || typeof name !== 'string' || typeof dataFeed !== 'string') {
            return {
                err: 1,
                message: 'All field must be string',
                data: null
            }
        }

        //update meteorological agency
        const updatedMeteorologicalAgency = await model.MeteorologicalAgency.update({
            agencyId: agencyId,
            name: name,
            dataFeed: dataFeed
        }, {
            where: {
                [Op.or]: [
                    { agencyId: agencyId },
                    { name: name }
                ]
            }
        });

        if (updatedMeteorologicalAgency === 0) {
            return {
                err: 1,
                message: 'No Meteorological Agency was updated',
                data: null
            }
        }

        const meteorologicalAgencyUpdated = await model.MeteorologicalAgency.findOne({
            where: {
                [Op.or]: [
                    { agencyId: agencyId },
                    { name: name }
                ]
            }
        });

        return {
            err: 0,
            message: 'Update successfully',
            data: meteorologicalAgencyUpdated
        }

    } catch (error) {
        console.log("Error updating meteorological agency: ", error);
        return {
            err: 1,
            message: 'Error updating meteorological agency'
        }
    }
}

//delete a meteorological agency by keyword
const deleteMeteorologicalAgency = async (data) => {
    try {
        const { agencyId, name } = data;

        //delete meteorological agency
        const deletedMeteorologicalAgency = await model.MeteorologicalAgency.destroy({
            where: {
                [Op.or]: [
                    { agencyId: agencyId },
                    { name: name }
                ]
            }
        });

        if (deletedMeteorologicalAgency === 0) {
            return {
                err: 1,
                message: 'No Meteorological Agency was deleted',
                data: null
            }
        }

        return {
            err: 0,
            message: 'Delete successfully',
            data: deletedMeteorologicalAgency
        }

    } catch (error) {
        console.log("Error deleting meteorological agency: ", error);
        return {
            err: 1,
            message: 'Error deleting meteorological agency'
        }
    }
}

module.exports = {
    getAllMeteorologicalAgency,
    getMeteorologicalAgencyByKeyword,
    createMeteorologicalAgency,
    updateMeteorologicalAgency,
    deleteMeteorologicalAgency
}