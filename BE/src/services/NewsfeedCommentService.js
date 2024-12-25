const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/index');
const { Op } = require("sequelize");


const getNewsfeedCommentsService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        if (!search_keyword) {
            return reject({
                error: 1,
                message: 'Keyword tìm kiếm không được để trống.',
            });
        }

        const response = await db.NewsfeedComment.findAll({
            where: { newsfeedId: search_keyword },
            limit: pageLimit,
            offset: offset,
            order: [['updatedAt', 'DESC']],
        });

        resolve({
            error: 0,
            message: 'Lấy danh sách Comments thành công',
            Comments: response,
            CurrentPage: pageIndex
        });
    } catch (error) {
        console.error('Error in getNewsfeedCommentsService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách Comments.'
        });
    }
});

const createNewsfeedCommentService = async (data) => {
    try {
        if (!data.newsfeedId) {
            return {
                error: 1,
                message: 'NewsfeedId không được để trống.',
            };
        }

        if (!data.userEmail) {
            return {
                error: 1,
                message: 'UserId không được để trống.',
            };
        }

        if (!data.comment || data.comment.trim() === '') {
            return {
                error: 1,
                message: 'Nội dung bình luận không được để trống.',
            };
        }

        const commentData = {
            newsfeedId: data.newsfeedId,
            userEmail: data.userEmail,
            comment: data.comment,
        };

        const newComment = await db.NewsfeedComment.create(commentData);

        return {
            error: 0,
            message: 'Tạo Comment thành công',
            newComment: newComment
        };
    } catch (error) {
        console.error('Error when create comment:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi tạo Comment: ${error.message}`,
        };
    }
};

const deleteNewsfeedCommentService = async (newsfeedCommentId) => {
    try {
        const newsfeedComment = await db.NewsfeedComment.findByPk(newsfeedCommentId);

        if (!newsfeedComment) {
            return {
                error: 1,
                message: `Không tìm thấy comment với id: ${newsfeedCommentId}`
            };
        }
        await newsfeedComment.destroy();
        return {
            error: 0,
            message: `Xóa comment với id: ${newsfeedCommentId} thành công`
        };
    } catch (error) {
        console.error('Error when deleting comment:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi xóa comment: ${error.message}`
        };
    }
};



module.exports = {
    getNewsfeedCommentsService,
    createNewsfeedCommentService,
    deleteNewsfeedCommentService,
};