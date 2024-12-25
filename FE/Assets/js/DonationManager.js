function getAllCampaigns(page){
    if(page===0) return;
    let search_keyword='Inprogress';
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCampaignByKey?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
    const Authorization=sessionStorage.getItem('Access_Token');
    console.log(url);
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(responseJSON => {
                    if(responseJSON.error===1)
                    {
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                    }
                    const data=responseJSON.campaigns;
                    populateCampaignsTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllCampaigns('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllCampaigns('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAllCampaigns('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.\n" + error.message);
    });
}

function populateCampaignsTable(data) {

    const tableBody = document.getElementById('campaigns-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(campaign => {
        const startDateFormatted = new Date(campaign.startDate).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const endDateFormatted = new Date(campaign.endDate).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${campaign.campaignId}</td>
      <td>${campaign.orgId}</td>
      <td>${campaign.remaining}</td>
      <td>${campaign.budget}</td>
      <td>${campaign.status}</td>
      <td>${campaign.description}</td>
      <td>${startDateFormatted}</td>
      <td>${endDateFormatted}</td>
    `;
        tableBody.appendChild(row);
    });

}

function checkValidOrgId()
{
    const addressInput = document.getElementById("orgId");
    const addressError = document.getElementById("orgId-error");
    if (!addressInput||!addressError) return;
    addressInput.addEventListener("blur",() => {
        if(addressInput.value.trim() === ""){addressError.textContent  = "Mã tổ chức không được bỏ trống.";}
        else{addressError.textContent  = null;}
    });
}

function checkValidAmount()
{
    const Input = document.getElementById("amount");
    const Error = document.getElementById("amount-error");

    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        const value = Input.value.trim();
        const amount  = parseInt(value, 10);
        if(value === ""){
            Error.textContent  = "Số tiền không được bỏ trống.";
        }else if (isNaN(amount) || amount < 50000) {
            Error.textContent = "Số tiền phải lớn hơn hoặc bằng 50,000 VND";
        }
        else{
            Error.textContent  = null;
        }
    });
}
checkValidOrgId()
checkValidAmount()


function createDonation(){
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const orgId =document.getElementById("orgId").value;
    const amount =document.getElementById("amount").value;
    if (!orgId||!orgId) return;

    sessionStorage.setItem('donateToOrgName',orgId);
    sessionStorage.setItem('amountOfDonation',amount);

    console.log(sessionStorage.getItem('donateToOrgName'));
    console.log(sessionStorage.getItem('amountOfDonation'));


    const donateData={
        amount: amount,
        bankCode:"VNBANK",
        language: "vn",
    }
    fetch(`${BACKEND_URL}/api/createdonation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify(donateData)
    })
        .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Đã xảy ra lỗi khi gửi đóng góp');
                    });
                }
            }
        )
        .then(response => {
            console.log(response)
            alert("Gửi đóng góp thành công, đi đến trang thanh toán!");
            window.location.href =response.url;
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi khi đăng ký:', error);
            alert("Đóng góp thất bại. \n" + error.message);
            window.location.href ="/Pages/donationsFalse.html";
        });
}

function vnPayReturn(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    let currentUrlQuery = window.location.search;

    currentUrlQuery=currentUrlQuery.split('?')[1];
    const queryObject = currentUrlQuery;
    const Authorization=sessionStorage.getItem('Access_Token');

    const orgId = sessionStorage.getItem('donateToOrgName');
    const cccd = sessionStorage.getItem('CCCD');
    const amount = sessionStorage.getItem('amountOfDonation');

    const saveData={
        orgId: orgId,
        cccd: cccd,
        amount: amount,
        paymentMethod: "Chuyển khoản qua VNPay",
        queryObject:queryObject
    }

    fetch(`${BACKEND_URL}/api/vnPayReturn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify(saveData)
    })
        .then(response => {
            sessionStorage.removeItem('donateToOrgName');
            sessionStorage.removeItem('amountOfDonation');

            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Đã xảy ra lỗi');
                });
            }
        }).then(responseJSON => {
        console.log(responseJSON);
        console.log(responseJSON.url.error);
        console.log(responseJSON.url.message);
        if (responseJSON.url.error === 1) {
            alert(`Lỗi trong quá trình lưu trữ dữ liệu: ${responseJSON.message}`);
            window.location.href = "/Pages/donationsFalse.html";
        } else {
            alert("Đóng góp của bạn đã được ghi nhận thành công!");
        }
    })
        .catch(error => {
            console.error('Đã xảy ra lỗi khi xử lý phản hồi từ VnPay', error);
            alert("Lưu đóng góp thất bại. \n" + error.message);
            window.location.href ="/Pages/donationsFalse.html";
        });
}
function checkVNPayReturn(){
    if (document.title === "Donations Success") {
        window.addEventListener('load', function () {
            vnPayReturn();
        });
    }
}
checkVNPayReturn();

async function getTotalAmountOfDonation(search_keyword = ''){
//const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/donation/countAmountOfDonation?search_keyword=${encodeURIComponent(search_keyword)}`;
    const Authorization=sessionStorage.getItem('Access_Token');
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json().then(responseJSON => {
                        if (responseJSON.error === 1) {
                            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin donation.');
                        }
                        resolve(responseJSON.totalAmount);
                    });
                } else {
                    return response.json().then(errorData => {
                        alert("Đã xảy ra lỗi khi lấy thông tin donation. \n" + errorData.message);
                        throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin donation.');
                    });
                }
            })
            .catch(error => {
                alert("Đã xảy ra lỗi khi lấy thông tin donation.\n" + error.message);
                reject(error);
            });
    });
}

async function countDonation(search_keyword = ''){
//const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/donation/countDonation?search_keyword=${encodeURIComponent(search_keyword)}`;
    const Authorization=sessionStorage.getItem('Access_Token');
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json().then(responseJSON => {
                        if (responseJSON.error === 1) {
                            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin donation.');
                        }
                        resolve(responseJSON.donationCount);
                    });
                } else {
                    return response.json().then(errorData => {
                        alert("Đã xảy ra lỗi khi lấy thông tin donation. \n" + errorData.message);
                        throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin donation.');
                    });
                }
            })
            .catch(error => {
                alert("Đã xảy ra lỗi khi lấy thông tin donation.\n" + error.message);
                reject(error);
            });
    });
}
