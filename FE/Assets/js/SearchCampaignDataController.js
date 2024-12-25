function getCampaign(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/campaigns?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;

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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch.');
                    }
                    const data=responseJSON.data;
                    populateCampaignTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getCampaign('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getCampaign('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getCampaign('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch.\n" + error.message);
    });
}

function populateCampaignTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(campaign => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${campaign.campaignId}</td>
      <td>${campaign.description}</td>
      <td>${campaign.orgId || 'Không'}</td>
      <td>${campaign.status === "Inprogress" ? "Đang hoạt động" : "Dừng hoạt động"}</td>
      <td>${campaign.remaining}</td>
      <td>${campaign.budget}</td>
      <td><!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateCampaign('${campaign.orgId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteCampaign('${campaign.orgId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function confirmDeleteCampaign(data) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa chiến dịch này?");
    if (isConfirmed) {
        adminDeleteCampaign(data);
    }
}


function adminDeleteCampaign(data) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteCampaign`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
            orgId: data
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa chiến dịch.');
                }
                alert("Xóa chiến dịch thành công\n" + responseJSON.message);
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi xóa. \n" + errorData.message);
            });
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xóa.\n" + error.message);
    });
}

function syncCampaignProfile(search_keyword){
    if (!search_keyword) {return;}
    let campaignNameTitle=document.getElementById("campaignNameTitle");
    let campaignId=document.getElementById("campaignId");
    let campaignDesc=document.getElementById("campaignDesc");
    let campaignOrgId = document.getElementById("campaignOrgId");
    let campaignRemaining=document.getElementById("campaignRemaining");
    let campaignBudget= document.getElementById("campaignBudget");
    let campaignStatus= document.getElementById("campaignStatus");
    let campaignDisasterId= document.getElementById("campaignDisasterId");
    let campaignDamages= document.getElementById("campaignDamages");
    let campaignStartDate= document.getElementById("campaignStartDate");
    let campaignEndDate= document.getElementById("campaignEndDate");

    if (!campaignId || !campaignDesc || !campaignOrgId || !campaignRemaining || !campaignBudget  || !campaignStatus || !campaignDisasterId|| !campaignDamages|| !campaignStartDate|| !campaignEndDate) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/campaigns?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(1)}`;

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
                        window.location.href ="/Pages/adminCampaignManagement.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch.');
                    }
                    const data=responseJSON.data;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu thông tin chiến dịch.");
                        window.location.href ="/Pages/adminCampaignManagement.html";
                        throw new Error('Không có dữ liệu thông tin chiến dịch.');
                    }

                    campaignNameTitle.innerHTML=data[0].campaignId;
                    campaignId.value=data[0].campaignId;
                    campaignOrgId.value=data[0].orgId;
                    campaignId.disabled=true;
                    campaignOrgId.disabled=true;

                    campaignDesc.value=data[0].description;
                    campaignRemaining.value = data[0].remaining;
                    campaignBudget.value = data[0].budget;
                    campaignStatus.value=data[0].status;
                    campaignDisasterId.value = data[0].disasterId;
                    campaignDamages.value = data[0].damages;
                    campaignStartDate.value = convertToDatetimeLocalFormat(data[0].startDate);
                    campaignEndDate.value = convertToDatetimeLocalFormat(data[0].endDate);
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch. \n" + errorData.message);
                    window.location.href ="/Pages/adminCampaignManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin chiến dịch.\n" + error.message);
        window.location.href ="/Pages/adminCampaignManagement.html";
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



function syncUpdateCampaign(data) {
    const disasterInfo = document.getElementById('disasterInfo');
    disasterInfo.classList.toggle('d-none');
    getAllDisater(1);

    const updateForm = document.getElementById('createCampaignForm');
    updateForm.classList.toggle('d-none');
    syncCampaignProfile(data);
}

function adminUpdateCampaignData(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

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


    const updateData = {
        campaignId:document.getElementById("campaignId").value,
        description:document.getElementById("campaignDesc").value,
        remaining: isNaN(parseInt(document.getElementById("campaignRemaining").value, 10)) ? 0 : parseInt(document.getElementById("campaignRemaining").value, 10),
        damages: isNaN(parseInt(document.getElementById("campaignDamages").value, 10)) ? 0 : parseInt(document.getElementById("campaignDamages").value, 10),
        budget: isNaN(parseInt(document.getElementById("campaignBudget").value,10)) ? 0 : parseInt(document.getElementById("campaignBudget").value,10),
        status:document.getElementById("campaignStatus").value,
        disasterId:document.getElementById("campaignDisasterId").value,
        orgId: document.getElementById("campaignOrgId").value,
        startDate: startDateTimeStamp,
        endDate: endDateTimeStamp
    };

    console.log('update data: ',updateData);

    fetch(`${BACKEND_URL}/api/updateCampaign`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify(updateData),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật chiến dịch.');
                }
                const data= responseJSON.data
                syncCampaignProfile(data.orgId);
                alert("Cập nhật chiến dịch thành công. \n");
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi cập nhật . \n" + errorData.message);
            });
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi cập nhật .\n" + error.message);
    });
}

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

function getAllDisater(page) {
    if (page === 0) return;
    let search_keyword = '';
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL = 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getDisasterByKey?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
    const Authorization = sessionStorage.getItem('Access_Token');
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
                    if (responseJSON.error === 1) {
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                    }
                    const data = responseJSON.disasters;
                    populateDisasterTable(data);

                    const prevPage = page - 1;
                    const nextPage = page + 1;

                    const paging = document.getElementById('disaster-paging');
                    const disableNext = !data || data.length === 0;
                    if (disableNext) {
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllDisater(${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" class="disabled" onclick="getAllDisater(${nextPage})"> Tiếp >>></a>`;
                    } else {
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllDisater(${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAllDisater(${nextPage})"> Tiếp >>></a>`;
                    }

                })
            } else {
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
