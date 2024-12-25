const db = require('../models/index');
const { Op } = require("sequelize");

const getHeatmapService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
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
                        { disasterId: { [Op.like]: `%${search_keyword}%` } },
                        { name: { [Op.like]: `%${search_keyword}%` } },
                        { severityId: { [Op.like]: `%${search_keyword}%` } },
                    ]
                };
            } else {
                searchConditions = {};
            }
        }
        const response = await db.Heatmap.findAndCountAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
            order: [['updatedAt', 'ASC']],
        });
        if (!response) {
            resolve({
                error: 1,
                message: 'Không tìm thấy Heatmap'
            });
        }
        else {
            resolve({
                error: 0,
                message: 'Lấy Heatmaps thành công',
                Heatmaps: response.rows,
                CurrentPage: pageIndex
            });
        }

    } catch (error) {
        console.error('Error in getHeatmap:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy Heatmap'
        });
    }
});

const getHeatmapByPKService = (heatmapId) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.Heatmap.findByPk(heatmapId);
        if (!response) {
            resolve({
                error: 1,
                message: 'Không tìm thấy Heatmap'
            });
        }
        else {
            resolve({
                error: 0,
                message: 'Lấy Heatmap thành công',
                Heatmap: response
            });
        }

    } catch (error) {
        console.error('Error in getHeatmap:', error);
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi khi lấy Heatmap'
        });
    }
});



const createHeatmapService = async (data) => {
    try {

        const heatmapExisted = await db.Heatmap.findOne({
            where: {
                name: data.name
            }
        });
        if (heatmapExisted) {
            return {
                error: 1,
                message: `Tên Heatmap "${data.name}" đã tồn tại. Vui lòng chọn tên khác.`
            };
        }

        const heatmapData = {
            disasterId: data.disasterId,
            name: data.name,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            severityId: data.severityId,
            CCCDAdmin: data.CCCDAdmin
        };

        const newHeatmap = await db.Heatmap.create(heatmapData);

        return {
            error: 0,
            message: 'Tạo Heatmap thành công',
            data: newHeatmap
        };
    } catch (error) {
        console.error(error);
        return {
            error: 1,
            message: error.message || 'Đã xảy ra lỗi khi tạo Heatmap',
        };
    }
};

const updateHeatmapService = async (data) => {
    try {
        const heatmapId = data.id
        if (!heatmapId) {
            return {
                error: 1,
                message: `Không tìm thấy Heatmap với id: ${heatmapId}`
            };
        }

        const heatmap = await db.Heatmap.findByPk(heatmapId);

        if (!heatmap) {
            return {
                error: 1,
                message: `Không tìm thấy Heatmap với id: ${heatmapId}`
            };
        }

        const updatedHeatmap = await heatmap.update({
            disasterId: data.disasterId,
            name: data.name,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            severityId: data.severityId,
            CCCDAdmin: data.CCCDAdmin
        });

        return {
            error: 0,
            message: `Cập nhật Heatmap với id: ${heatmapId} thành công`,
            data: updatedHeatmap
        };
    } catch (error) {
        console.error('Error when updating Heatmap:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi cập nhật Heatmap: ${error.message}`
        };
    }
};

const deleteHeatmapService = async (heatmapId) => {
    try {
        const heatmap = await db.Heatmap.findByPk(heatmapId);

        if (!heatmap) {
            return {
                error: 1,
                message: `Không tìm thấy Heatmap với id: ${heatmapId}`
            };
        }
        await heatmap.destroy();
        return {
            error: 0,
            message: `Xóa Heatmap với id: ${heatmapId} thành công`
        };
    } catch (error) {
        console.error('Error when deleting Heatmap:', error);
        return {
            error: 1,
            message: `Đã xảy ra lỗi khi xóa Heatmap: ${error.message}`
        };
    }
};




module.exports = {
    getHeatmapService, getHeatmapByPKService, createHeatmapService, updateHeatmapService, deleteHeatmapService,
}