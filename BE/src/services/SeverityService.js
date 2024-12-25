const db = require('../models/index');


const getSeverityService = (search_keyword) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.Severity.findOne({
            where: { id: search_keyword }
        });
        if (!response) {
            resolve({
                error: 1,
                message: 'Không tìm thấy Severity'
            });
        }
        else {
            response.gradient = JSON.parse(response.gradient);
            resolve({
                error: 0,
                message: 'Lấy Severity thành công',
                Severity: response
            });
        }

    } catch (error) {
        console.error('Error in getSeverity:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy Severity'
        });
    }
});

module.exports = {
    getSeverityService
}