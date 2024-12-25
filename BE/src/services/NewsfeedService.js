const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/index');
const { Op } = require("sequelize");

const scrapeTitleService = async (data) => {
    try {
        const url = data.url;

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const results = [];
        $(".horizontalPost").each(function () {
            const title = $(this).find("a").attr("title");
            const articleUrl = $(this).find("a").attr("href");
            const resultUrl = articleUrl.split("/");
            const thumbnails = $(this).find("a > picture > img").attr("data-srcset");
            const summary = $(this).find("p").text().trim();


            results.push({
                title: title,
                articleUrl: resultUrl.splice(-1)[0],
                thumbnails: thumbnails,
                summary: summary
            });
        });
        if (!results || results.length === 0) {
            return {
                error: 1,
                message: 'No titles found on the page.'
            };
        }

        return {
            error: 0,
            message: 'Get title successfully',
            newsTitles: results
        };
    } catch (error) {
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi lấy title: ${error.message}`
        };
    }
};


const scrapeContentService = async (data) => {
    try {
        let url = data.newsUrl + data.articleUrl;

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const results = {
            description: [],
            images: []
        };
        $("div.maincontent").each(function () {
            $(this).find("p").each(function () {
                results.description.push($(this).text().trim());
            });
            $(this).find("figure").each(function () {
                const imageSrc = $(this).find("picture > img").attr("data-srcset");
                const caption = $(this).find("figcaption").text().trim(); // Lấy nội dung figcaption

                if (imageSrc) {
                    results.images.push({
                        src: imageSrc.trim(),
                        caption: caption || null // Nếu không có caption, trả về null
                    });
                }
            });

        });
        if (results.description.length === 0 && results.images.length === 0) {
            return {
                error: 1,
                message: 'No content found on the page.'
            };
        }

        return {
            error: 0,
            message: 'Get content successfully',
            newsContent: results
        };

    } catch (error) {
        console.log(error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi lấy content: ${error.message}`
        };
    }
};

const getNewsfeedService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        let searchConditions = {};
        if (/^\d{4}-\d{2}-\d{2}$/.test(search_keyword)) {
            searchConditions = {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.literal("CONVERT(DATE, [updatedAt])"),
                        search_keyword
                    )
                ]
            };
        }
        else {
            if (search_keyword !== '') {
                searchConditions = {
                    [Op.or]: [
                        { newsAgency: { [Op.like]: `%${search_keyword}%` } },
                        { title: { [Op.like]: `%${search_keyword}%` } },
                        { id: { [Op.like]: `%${search_keyword}%` } },
                    ]
                };
            } else {
                searchConditions = {};
            }
        }
        const response = await db.NewsFeed.findAndCountAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
            order: [['updatedAt', 'DESC']],
        });

        resolve({
            error: 0,
            message: 'Lấy danh sách Newsfeed thành công',
            Feedbacks: response.rows,
            CurrentPage: pageIndex
        });
    } catch (error) {
        console.error('Error in getNewsfeedService:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy danh sách Newsfeed.'
        });
    }
});

const getNewsfeedByPKService = (newsfeedId) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.NewsFeed.findByPk(newsfeedId);
        if (!response) {
            resolve({
                error: 1,
                message: 'Không tìm thấy Newsfeed'
            });
        }
        else {
            resolve({
                error: 0,
                message: 'Lấy Newsfeed thành công',
                Newsfeed: response
            });
        }

    } catch (error) {
        console.error('Error in getNewsfeed:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy Newsfeed'
        });
    }
});

const createNewsfeedService = async (data) => {
    try {
        const existingNewsfeed = await db.NewsFeed.findOne({
            where: { title: data.title },
            raw: true
        });

        if (existingNewsfeed) {
            return {
                error: 1,
                message: 'Tiêu đề này đã tồn tại, vui lòng sử dụng tiêu đề khác.'
            };
        }


        const newsfeedData = {
            newsAgency: data.newsAgency,
            title: data.title,
            articleUrl: data.articleUrl,
            thumbnails: data.thumbnails,
            summary: data.summary,
            content: data.content
        };

        const newFeedback = await db.NewsFeed.create(newsfeedData);

        return {
            error: 0,
            message: 'Tạo feedback thành công',
            data: newFeedback
        };
    } catch (error) {
        return {
            error: 1,
            message: 'Đã xảy ra lỗi khi tạo Newsfeed',
        };
    }
};

const updateNewsfeedService = async (data) => {
    try {

        const newsfeedId = data.id
        if (!newsfeedId) {
            return {
                error: 1,
                message: `Chưa nhập newsfeed id.`
            };
        }

        const newsfeed = await db.NewsFeed.findByPk(newsfeedId);

        if (!newsfeed) {
            return {
                error: 1,
                message: `Không tìm thấy newsfeed với id: ${newsfeedId}`
            };
        }

        const updatedNewsfeed = await newsfeed.update({
            newsAgency: data.newsAgency,
            title: data.title,
            articleUrl: data.articleUrl,
            thumbnails: data.thumbnails,
            summary: data.summary,
            content: data.content
        });

        return {
            error: 0,
            message: `Cập nhật newsfeed với id: ${newsfeedId} thành công`,
            data: updatedNewsfeed
        };
    } catch (error) {
        console.error('Error when updating newsfeed:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi cập nhật newsfeed: ${error.message}`
        };
    }
};

const deleteNewsfeedService = async (newsfeedId) => {
    try {
        const newsfeed = await db.NewsFeed.findByPk(newsfeedId);

        if (!newsfeed) {
            return {
                error: 1,
                message: `Không tìm thấy newsfeed với id: ${newsfeedId}`
            };
        }
        await newsfeed.destroy();
        return {
            error: 0,
            message: `Xóa newsfeed với id: ${newsfeedId} thành công`
        };
    } catch (error) {
        console.error('Error when deleting newsfeed:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi xóa newsfeed: ${error.message}`
        };
    }
};



module.exports = {
    scrapeTitleService,
    scrapeContentService,
    getNewsfeedService,
    getNewsfeedByPKService,
    createNewsfeedService,
    updateNewsfeedService,
    deleteNewsfeedService
};