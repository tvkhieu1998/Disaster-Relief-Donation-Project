const db = require('../models/index');
const { Op } = require("sequelize");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');

const createVNPayDonationService = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            process.env.TZ = 'Asia/Ho_Chi_Minh';

            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');

            const ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const tmnCode = process.env.VNP_TMNCODE;
            const secretKey = process.env.VNP_HASHSECRET;
            const vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURNURL;
            const orderId = moment(date).format('DDHHmmss');
            const amount = req.body.amount;
            const bankCode = req.body.bankCode;

            let locale = req.body.language || 'vn';
            const currCode = 'VND';

            let vnp_Params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'pay',
                'vnp_TmnCode': tmnCode,
                'vnp_Locale': locale,
                'vnp_CurrCode': currCode,
                'vnp_TxnRef': orderId,
                'vnp_OrderInfo': `Thanh toan cho ma GD: ${orderId}`,
                'vnp_OrderType': 'other',
                'vnp_Amount': amount * 100,
                'vnp_ReturnUrl': returnUrl,
                'vnp_IpAddr': ipAddr,
                'vnp_CreateDate': createDate,
            };

            if (bankCode) {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            const querystring = require('qs');
            const signData = querystring.stringify(vnp_Params, { encode: false });
            const crypto = require("crypto");
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

            resolve(paymentUrl);
        } catch (error) {
            reject(error);
        }
    });

const vnPayReturnService = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let save_Data = req.body;
            console.log(save_Data);

            const rawQueryString = save_Data.queryObject;
            console.log(rawQueryString);

            const urlParams = new URLSearchParams(rawQueryString);
            const parsedQuery = Object.fromEntries(urlParams.entries());
            console.log('parsedQuery:', parsedQuery);

            let vnp_Params = parsedQuery;

            let TransactionStatus = vnp_Params['vnp_TransactionStatus'];
            console.log('TransactionStatus ', TransactionStatus);


            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let secretKey = process.env.VNP_HASHSECRET;

            const querystring = require('qs');
            const signData = querystring.stringify(vnp_Params, { encode: false });
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha512', secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            const amount = Number(save_Data.amount);

            if (secureHash === signed && TransactionStatus === '00') {
                try {

                    try {
                        await db.Donation.create({
                            orgId: save_Data.orgId,
                            cccd: save_Data.cccd,
                            amount: amount,
                            paymentMethod: save_Data.paymentMethod,
                            status: "Thanh toán thành công"
                        });

                        //Find Campaign and update
                        const campaign = await db.Campaign.findOne({
                            where: { orgId: save_Data.orgId },
                        });
                        if (campaign) {
                            const currentRemaining = Number(campaign.remaining) || 0;
                            const donationAmount = Number(amount);

                            campaign.remaining = currentRemaining + donationAmount;
                            await campaign.save();
                        }
                    } catch (error) {
                        console.error('Error saving donation:', error);
                    }

                    resolve({
                        error: 0,
                        code: vnp_Params['vnp_ResponseCode'],
                        message: 'Giao dịch hợp lệ',
                        data: vnp_Params
                    });
                } catch (error) {

                    await db.Donation.create({
                        orgId: save_Data.orgId,
                        cccd: save_Data.cccd,
                        amount: amount,
                        paymentMethod: save_Data.paymentMethod,
                        status: "Thanh toán thất bại"
                    });

                    reject({
                        error: 1,
                        message: 'Lỗi trong quá trình lưu dữ liệu',
                        details: error.message
                    });
                }

            } else {
                await db.Donation.create({
                    orgId: save_Data.orgId,
                    cccd: save_Data.cccd,
                    amount: amount,
                    paymentMethod: save_Data.paymentMethod,
                    status: "Thanh toán thất bại"
                });
                resolve({
                    error: 1,
                    code: '97',
                    message: 'Chữ ký không hợp lệ'
                });
            }
        } catch (error) {
            reject({
                error: 1,
                message: 'Đã xảy ra lỗi trong quá trình xử lý'
            });
        }
    });
};

const getTotalAmountOfDonationService = (search_keyword) => new Promise(async (resolve, reject) => {
    try {
        const whereCondition = search_keyword
            ? { cccd: search_keyword, status: 'Thanh toán thành công' }
            : { status: 'Thanh toán thành công' };

        const totalAmount = await db.Donation.sum('amount', {
            where: whereCondition,
        });

        resolve({
            error: 0,
            message: 'Lấy kết quả thành công',
            cccd: search_keyword,
            totalAmount: totalAmount || 0
        });

    } catch (error) {
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi trong quá trình xử lý'
        })
    }
})

const countDonationService = (search_keyword) => new Promise(async (resolve, reject) => {
    try {
        const whereCondition = search_keyword
            ? { cccd: search_keyword }
            : {};

        const donationCount = await db.Donation.count({
            where: whereCondition,
        });

        resolve({
            error: 0,
            message: 'Lấy kết quả thành công',
            cccd: search_keyword,
            donationCount: donationCount || 0
        });

    } catch (error) {
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi trong quá trình xử lý'
        })
    }
})


const getDonationsService = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {
        const pageLimit = 10;
        const offset = (pageIndex - 1) * pageLimit;

        const whereCondition = search_keyword
            ? {
                [Op.or]: [
                    { cccd: { [Op.like]: `%${search_keyword}%` } },
                    { orgId: { [Op.like]: `%${search_keyword}%` } },
                ]
            }
            : {};

        const donationList = await db.Donation.findAll({
            where: whereCondition,
            limit: pageLimit,
            offset: offset,
        });

        resolve({
            error: 0,
            message: 'Lấy kết quả thành công',
            cccd: search_keyword,
            donationList: donationList,
            CurrentPage: pageIndex
        });

    } catch (error) {
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi trong quá trình xử lý'
        })
    }
})

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createVNPayDonationService, vnPayReturnService, getTotalAmountOfDonationService, countDonationService, getDonationsService
};