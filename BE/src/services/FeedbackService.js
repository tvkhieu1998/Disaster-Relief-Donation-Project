const db = require('../models/index');
const { Op } = require("sequelize");


const getFeedbackStatisticService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.FeedBack.findAll();
        resolve({
            error: 0,
            message: 'Lấy tất cả feedback thành công',
            Feedbacks: response
        });
    } catch (error) {
        console.error('Error in getFeedbackStatisticService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách feedback'
        });
    }
});

const getAllFeedbackService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        let searchConditions = {};
        if (search_keyword === "true" || search_keyword === "false") {
            searchConditions = { isVictim: search_keyword.toLowerCase() === "true" };
        }
        else if (/^\d{4}-\d{2}-\d{2}$/.test(search_keyword)) {
            searchConditions = {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.literal("CONVERT(DATE, [createdAt])"),
                        search_keyword
                    )
                ]
            };
        }
        else {
            if (search_keyword !== '') {
                searchConditions = {
                    [Op.or]: [
                        { victimCCCD: { [Op.like]: `%${search_keyword}%` } },
                        { userCCCD: { [Op.like]: `%${search_keyword}%` } },
                        { comment: { [Op.like]: `%${search_keyword}%` } },
                    ]
                };
            } else {
                searchConditions = {};
            }
        }
        const response = await db.FeedBack.findAndCountAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
            order: [['createdAt', 'ASC']],
        });

        resolve({
            error: 0,
            message: 'Lấy danh sách feedback thành công',
            Feedbacks: response.rows,
            CurrentPage: pageIndex
        });
    } catch (error) {
        console.error('Error in getAllFeedbackService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách feedback'
        });
    }
});



const createFeedbackService = async (data) => {
    try {
        const feedbackData = {
            isVictim: data.isVictim,
            userCCCD: data.userCCCD,
            rating: data.rating,
            comment: data.comment
        };

        const newFeedback = await db.FeedBack.create(feedbackData);

        return {
            error: 0,
            message: 'Tạo feedback thành công',
            data: newFeedback
        };
    } catch (error) {
        return {
            error: 1,
            message: 'Đã xảy ra lỗi khi feedback',
        };
    }
};

const deleteFeedbackService = async (feedbackId) => {
    try {
        const feedback = await db.FeedBack.findByPk(feedbackId);

        if (!feedback) {
            return {
                error: 1,
                message: `Không tìm thấy feedback với id: ${feedbackId}`
            };
        }
        await feedback.destroy();
        return {
            error: 0,
            message: `Xóa feedback với id: ${feedbackId} thành công`
        };
    } catch (error) {
        console.error('Error when deleting feedback:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi xóa feedback: ${error.message}`
        };
    }
};






module.exports = {
    createFeedbackService, deleteFeedbackService, getAllFeedbackService, getFeedbackStatisticService
}