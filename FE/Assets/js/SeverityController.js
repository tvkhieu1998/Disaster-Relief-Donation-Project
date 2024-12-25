async function getSeverity(search_keyword){

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/getSeverity?search_keyword=${encodeURIComponent(search_keyword)}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu Severity.');
        }

        const responseJSON = await response.json();

        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy Severity.');
        }
        let data = responseJSON.Severity;
        return {
            radius: data.radius,
            blur: data.blur,
            maxZoom: data.maxZoom,
            gradient: data.gradient
        };

    } catch (error) {
        console.error('Lỗi khi lấy Severity:', error);
        throw new Error(error.message);
    }
}