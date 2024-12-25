const HttpStatus = {
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
};

const ApiError = Object.freeze({
    API_ERROR_000_RESQUEST_ERROR: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Lỗi khi gửi thông tin đến máy chủ',
    },
    API_ERROR_000_RESQUEST_FORBIDDEN: {
        status: HttpStatus.FORBIDDEN,
        message: 'Tài khoản của bạn không có quyền thực hiện hành động này.',
    },
    API_ERROR_000_INTERNAL_SERVER_ERROR: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi khi xử lý dữ liệu ở máy chủ',
    },
    API_ERROR_001_REQUEST_TOKEN: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Không tìm thấy access token.',
    },
    API_ERROR_002_INVALID_TOKEN: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Token không hợp lệ.',
    },
    API_ERROR_003_RESQUEST_VNPAY_FAILURE: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Lỗi khi gửi yêu cầu thanh toán qua VNPay',
    },
    API_ERROR_004_RETURN_VNPAY_FAILURE: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Lỗi khi gửi nhận phản hồi từ VNPay',
    },
});
module.exports = { ApiError, HttpStatus };
