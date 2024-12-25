function getAllDisater(page){
    if(page===0) return;
    let search_keyword='';
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getDisasterByKey?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                    }
                    const data=responseJSON.disasters;
                    populateDisasterTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllDisater(${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllDisater(${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAllDisater(${nextPage})"> Tiếp >>></a>`;
                    }

                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin thiên tai. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                });
            }
        }).catch(error => {
        console.error("Error fetching:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin thiên tai.\n" + error.message);
    });
}

function populateDisasterTable(data) {

    const tableBody = document.getElementById('disasters-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(disaster => {

        const row = document.createElement('tr');
        row.innerHTML = `
      
      <td>${disaster.disasterId}</td>
      <td>${disaster.description}</td>
    `;
        tableBody.appendChild(row);
    });

}


function checkValidId()
{
    const Input = document.getElementById("campaignId");
    const Error = document.getElementById("campaignId-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Tên chiến dịch không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidDesc()
{
    const Input = document.getElementById("campaignDesc");
    const Error = document.getElementById("campaignDesc-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Miêu tả chiến dịch không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidRemaining()
{
    const Input = document.getElementById("campaignRemaining");
    const Error = document.getElementById("campaignRemaining-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Số tiền hiện có không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidBudget()
{
    const Input = document.getElementById("campaignBudget");
    const Error = document.getElementById("campaignBudget-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Số tiền mục tiêu không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidStatus()
{
    const Input = document.getElementById("campaignStatus");
    const Error = document.getElementById("campaignStatus-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Trạng thái chiến dịch không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidDisasterId()
{
    const Input = document.getElementById("campaignDisasterId");
    const Error = document.getElementById("campaignDisasterId-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Tên thiên tai không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidDamages()
{
    const Input = document.getElementById("campaignDamages");
    const Error = document.getElementById("campaignDamages-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Thiệt hại không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidStartDate() {
    const Input = document.getElementById("campaignStartDate");
    const Error = document.getElementById("campaignStartDate-error");

    if (!Input || !Error) return;

    Input.addEventListener("blur", () => {
        const value = Input.value.trim();
        if (value === "") {
            Error.textContent = "Ngày bắt đầu không được bỏ trống.";
        } else if (new Date(value) < new Date()) {
            Error.textContent = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại.";
        } else {
            Error.textContent = "";
        }
    });
}

function checkValidEndDate() {
    const Input = document.getElementById("campaignEndDate");
    const Error = document.getElementById("campaignEndDate-error");

    if (!Input || !Error) return;

    Input.addEventListener("blur", () => {
        const value = Input.value.trim();
        const startDate = document.getElementById("campaignStartDate").value.trim();

        if (value === "") {
            Error.textContent = "Ngày kết thúc không được bỏ trống.";
        } else if (startDate && new Date(value) <= new Date(startDate)) {
            Error.textContent = "Ngày kết thúc phải lớn hơn ngày bắt đầu.";
        } else {
            Error.textContent = "";
        }
    });
}

//Check all input fields:
checkValidId();
checkValidDesc();
checkValidRemaining();
checkValidBudget();
checkValidStatus();
checkValidDisasterId();
checkValidDamages();
checkValidStartDate();
checkValidEndDate();










function createCampaignCharity(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    let startDate=document.getElementById("campaignStartDate").value;
    let endDate=document.getElementById("campaignEndDate").value;
    let startDateTimeStamp = null;
    let endDateTimeStamp = null;
    if (startDate) {
        const startDateObj = new Date(startDate);
        if (!isNaN(startDateObj.getTime())) {
            startDateTimeStamp = startDateObj.toISOString();
        }
    }
    if (endDate) {
        const endDateObj = new Date(endDate);
        if (!isNaN(endDateObj.getTime())) {
            endDateTimeStamp = endDateObj.toISOString();
        }
    }

    const campaignData={
        campaignId:document.getElementById("campaignId").value,
        description:document.getElementById("campaignDesc").value,
        remaining: isNaN(parseInt(document.getElementById("campaignRemaining").value, 10)) ? 0 : parseInt(document.getElementById("campaignRemaining").value, 10),
        damages: isNaN(parseInt(document.getElementById("campaignDamages").value, 10)) ? 0 : parseInt(document.getElementById("campaignDamages").value, 10),
        budget: isNaN(parseInt(document.getElementById("campaignBudget").value,10)) ? 0 : parseInt(document.getElementById("campaignBudget").value,10),
        status:document.getElementById("campaignStatus").value,
        disasterId:document.getElementById("campaignDisasterId").value,
        orgId:sessionStorage.getItem("orgId"),
        startDate:startDateTimeStamp,
        endDate:endDateTimeStamp,
    }
    fetch(`${BACKEND_URL}/api/createCampaign`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
    }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi tạo mới chiến dịch.');
                });
            }
        }).then(responseJSON => {
            console.log('responseJSON: ',responseJSON);
            if (responseJSON.error === 1) {
                alert("Mở chiến dịch thất bại.");
                //window.location.href ="/Pages/personal.html";
                throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi mở chiến dịch.');
            }
            alert("Mở chiến dịch thành công!\n"+responseJSON.message);
        }).catch(error => {
            alert("Đăng ký mở chiến dịch thất bại. \n" + error.message);
            //window.location.href ="/Pages/personal.html";
        });
}

function syncCampaignCharityCProfile(search_keyword){
    if (!search_keyword) {return;}
    let campaignId=document.getElementById("campaignId");
    let description=document.getElementById("campaignDesc");
    let remaining= document.getElementById("campaignRemaining");
    let damages= document.getElementById("campaignDamages");
    let budget= document.getElementById("campaignBudget");
    let status=document.getElementById("campaignStatus");
    let disasterId=document.getElementById("campaignDisasterId");
    let startDate=document.getElementById("campaignStartDate");
    let endDate=document.getElementById("campaignEndDate");

    if (!campaignId || !description || !remaining || !damages ||
        !budget || !status || !disasterId || !startDate || !endDate) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCampaignByKey?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(1)}`;
    const Authorization=sessionStorage.getItem('Access_Token');
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
                        window.location.href ="/Pages/personal.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                    }
                    const data=responseJSON.campaigns;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu chiến dịch từ thiện.");
                        window.location.href ="/Pages/personal.html";
                        throw new Error('Không có dữ liệu chiến dịch từ thiện.');
                    }
                    campaignId.value=data[0].campaignId;
                    campaignId.disabled=true;
                    description.value=data[0].description;
                    remaining.value=data[0].remaining;
                    damages.value=data[0].damages;
                    budget.value=data[0].budget;
                    status.value=data[0].status;
                    disasterId.value=data[0].disasterId;
                    startDate.value=convertToDatetimeLocalFormat(data[0].startDate);
                    endDate.value=convertToDatetimeLocalFormat(data[0].endDate);
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện. \n" + errorData.message);
                    window.location.href ="/Pages/personal.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.\n" + error.message);
        window.location.href ="/Pages/personal.html";
    });
}
function convertToDatetimeLocalFormat(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function updateCampaignCharity(search_keyword){
//const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    let startDate=document.getElementById("campaignStartDate").value;
    let endDate=document.getElementById("campaignEndDate").value;
    let startDateTimeStamp = null;
    let endDateTimeStamp = null;
    if (startDate) {
        const startDateObj = new Date(startDate);
        if (!isNaN(startDateObj.getTime())) {
            startDateTimeStamp = startDateObj.toISOString();
        }
    }
    if (endDate) {
        const endDateObj = new Date(endDate);
        if (!isNaN(endDateObj.getTime())) {
            endDateTimeStamp = endDateObj.toISOString();
        }
    }

    const campaignData={
        campaignId:document.getElementById("campaignId").value,
        description:document.getElementById("campaignDesc").value,
        remaining: isNaN(parseInt(document.getElementById("campaignRemaining").value, 10)) ? 0 : parseInt(document.getElementById("campaignRemaining").value, 10),
        damages: isNaN(parseInt(document.getElementById("campaignDamages").value, 10)) ? 0 : parseInt(document.getElementById("campaignDamages").value, 10),
        budget: isNaN(parseInt(document.getElementById("campaignBudget").value,10)) ? 0 : parseInt(document.getElementById("campaignBudget").value,10),
        status:document.getElementById("campaignStatus").value,
        disasterId:document.getElementById("campaignDisasterId").value,
        orgId:search_keyword,
        startDate:startDateTimeStamp,
        endDate:endDateTimeStamp,
    }
    console.log("Rawdata: " ,  JSON.stringify(campaignData, null, 2));
    fetch(`${BACKEND_URL}/api/updateCampaign`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
    }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi cập nhật chiến dịch.');
                });
            }

            }).then(responseJSON => {
        console.log('responseJSON: ',responseJSON);
        console.log('responseJSON: ',responseJSON.error);
        if (responseJSON.error === 1) {
            alert("Cập nhật chiến dịch thất bại.");
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật chiến dịch.');
        }
        alert("Cập nhật chiến dịch từ thiện thành công!\n"+responseJSON.message);
    }).catch(error => {
            alert("Cập nhật chiến dịch từ thiện thất bại. \n" + error.message);
        });
}
//window.location.href ="/Pages/personal.html";
function UpdateDonationToRemaining(search_keyword){

    let remaining= document.getElementById("campaignRemaining");
    let buttonUpdate= document.getElementById("button-update-remaining");

    if (!remaining || !buttonUpdate) {
        return;
    }
    buttonUpdate.classList.add('disabled');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/updateCampaignRemaining?search_keyword=${encodeURIComponent(search_keyword)}`;
    const Authorization=sessionStorage.getItem('Access_Token');
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
                        buttonUpdate.classList.remove('disabled');
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                    }
                    remaining.value=responseJSON.totalAmount;
                    buttonUpdate.classList.remove('disabled');
                })
            }else {
                return response.json().then(errorData => {
                    buttonUpdate.classList.remove('disabled');
                    alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.');
                });
            }
        }).catch(error => {
        buttonUpdate.classList.remove('disabled');
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch từ thiện.\n" + error.message);
    });
}