const { getAllCharityOrg,
    getCharityOrdByKeyword,
    createCharityOrg,
    updateCharity,
    deleteCharityOrg } = require('../services/CharityOrganizationService');

const { ApiError, HttpStatus } = require('../config/ApiError');

// get all charity organizations
const getCharityOrgs = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getAllCharityOrg(search_keyword, pageIndex);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get charity organization by keyword
const getCharityOrgByKey = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getCharityOrdByKeyword(search_keyword);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// create a new charity organization
const createCharityOrgs = async (req, res) => {
    try {
        const data = req.body;
        const response = await createCharityOrg(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// update chairty organization by orgId & orgname
const updateCharityOrgs = async (req, res) => {
    try {
        // const { keyword } = req.query;
        //const { keyword } = req.params;
        const data = req.body;
        const response = await updateCharity(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// delete chairty organization by orgId & orgname
const deleteCharityOrgs = async (req, res) => {
    try {
        // const { keyword } = req.params;
        const data = req.body;  // data = { orgId: 'orgId', orgname: 'orgname' }
        const response = await deleteCharityOrg(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

module.exports = { getCharityOrgs, getCharityOrgByKey, createCharityOrgs, updateCharityOrgs, deleteCharityOrgs };