'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const {Op} = sequelize;

//get all victims
const getAllVictims = async () => {
    try {
        const victims = await models.Victim.findAll({
            where: {
                cccd: {
                    [Op.ne]: null,   // Lấy tất cả các bản ghi có cccd khác null
                }
            }
        });
        return {
            err: 0,
            message: 'Get all victims successfully',
            data: victims
        }
    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            err: 1,
            message: 'Error fetching data'
        }
    }
}

//get a victim by keyword: cccd or name
const getVictimByKeyword = async (keyword) => {
    try {
        if (!keyword) {
            throw new Error({
                err: 1,
                message: 'Keyword is required',
                data: null
            });
        }

        const victim = await models.Victim.findOne({
            where: {
                [Op.or]: [
                    { CCCD: keyword },
                    { name: keyword }
                ]
            }
        });
        return victim;
    } catch (error) {
        console.log("Error fetching data get a victim by keyword: ", error);
        return {
            err: 1,
            message: 'Error fetching data get a victim by keyword',
            data: null
        }
    }
}

//create a new victim
const createVictim = async (data) => {
    try {
        const { cccd, name, damages, received, disasterId } = data;
        //check if orgId or orgname is already existed
        const existed = await models.Victim.findOne({
            where: { [Op.or]: [
                { cccd: cccd },
                { name: name },
                ],
            },
        });
        if (existed) {
            return {
                err: 1,
                message: 'Victim is already existed',
                data: null
            }
        }

        // check if CCCD or name or damages or received or receivedDate or disasterId is null
        if (!cccd || !name || !damages || !received || !disasterId) {
            return {
                err: 1,
                message: 'CCCD, name, damages, received, receivedDate, disasterId are required',
                data: null
            }
        }

        // check if CCCD or name or damages or received or receivedDate or disasterId is invalid
        if (typeof cccd !== 'string' || typeof name !== 'string' || typeof damages !== 'string' || typeof received !== 'string' || typeof disasterId !== 'string') {
            return {
                err: 1,
                message: 'Invalid data types. All fields must be strings.',
                data: null
            }
        }

        // create a new victim
        const newVictim = await models.Victim.create({
            cccd: cccd,
            name: name,
            damages: damages,
            received: received,
            disasterId: disasterId,
        });

        return {
            err: 0,
            message: 'Create successfully',
            data: newVictim
        }
        
    } catch (error) {
        console.log("Error fetching data to create: ", error);
        return {
            err: 1,
            message: 'Error fetching data to create.',
            data: null
        }
    }
};

//update a victim
const updateVictim = async (data) => {
    try {
        const { cccd, name, damages, received, disasterId } = data;
        // check if keyword is not existed
        const existed = await getVictimByKeyword(cccd || name);
        if (!existed) {
            return {
                err: 1,
                message: 'Victim is not existed',
                data: null
            }
        }

        // check if CCCD or name or damages or received or receivedDate or disasterId is null
        if (!cccd || !name || !damages || !received || !disasterId) {
            return {
                err: 1,
                message: 'CCCD, name, damages, received, disasterId are required',
                data: null
            }
        }

        // check if CCCD or name or damages or received or receivedDate or disasterId is invalid
        if (typeof cccd !== 'string' || typeof name !== 'string' || typeof damages !== 'string' || typeof received !== 'string' || typeof disasterId !== 'string') {
            return {
                err: 1,
                message: 'Invalid data types. All fields must be strings.',
                data: null
            }
        }

        // update a charity organization
        const [victim] = await models.Victim.update({
            cccd: cccd,
            name: name,
            damages: damages,
            received: received,
            disasterId: disasterId
        }, {
            where: {
                [Op.or]: [
                    { cccd: cccd },
                    { name: name },
                ],
            }
        });

        // check if charity organization is not updated
        if (victim === 0) {
            return {
                err: 1,
                message: 'No Victim was updated.',
                data: null
            };
        }

        const victimUpdated = await models.Victim.findOne({
            where: {
                [Op.or]: [
                    { cccd: cccd },
                    { name: name },
                ],
            }
        });
        
        return {
            err: 0,
            message: 'Update successfully',
            data: victimUpdated
        }
        
    } catch (error) {
        console.log("Error while updating victim:", error);
        return {
            err: 1,
            message: 'An error occurred while updating victim.',
            data: error.message
        };
    }
};
//delete a victim
const deleteVictim = async (data) => {
    try {
        const { cccd, name } = data;
        // check if keyword is not existed
        const existed = await getVictimByKeyword(cccd || name);
        if (!existed) {
            return {
                err: 1,
                message: 'Victim is not existed',
                data: null
            }
        }
        // delete a victim
        const victim = await models.Victim.destroy({
            where: {
                [Op.or]: [
                    { cccd: cccd },
                    { name: name },
                ],
            }
        });

        // check if victim is not deleted
        if (victim === 0) {
            return {
                err: 1,
                message: 'No Victim was deleted.',
                data: null
            };
        }
        
        return {
            err: 0,
            message: 'Delete successfully',
            data: victim
        }
        
    } catch (error) {
        console.log("Error while deleting Victim:", error);
        return {
            err: 1,
            message: 'An error occurred while deleting the Victim.',
            data: error.message
        };
    }
};

module.exports = {
    getAllVictims,
    getVictimByKeyword,
    createVictim,
    updateVictim,
    deleteVictim
}

