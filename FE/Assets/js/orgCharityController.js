function checkValidName()
{
    const Input = document.getElementById("orgName");
    const Error = document.getElementById("orgName-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Tên tổ chức không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidId()
{
    const Input = document.getElementById("orgId");
    const Error = document.getElementById("orgId-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Mã tổ chức không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidContractInfo()
{
    const Input = document.getElementById("contractInfo");
    const Error = document.getElementById("contractInfo-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Thông tin liên lạc tổ chức không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidLicense()
{
    const Input = document.getElementById("license");
    const Error = document.getElementById("license-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Giấy phép tổ chức không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}
//Check all input fields:
checkValidName();
checkValidId();
checkValidContractInfo();
checkValidLicense();


function createOrgCharity(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    const roleCode = sessionStorage.getItem('roleCode');
    let isVerify=roleCode === '1';

    const orgData={
        orgId:document.getElementById("orgId").value,
        orgname:document.getElementById("orgName").value,
        contractInfo: document.getElementById("contractInfo").value,
        license: document.getElementById("license").value,
        isVerify: isVerify,
        cccd:sessionStorage.getItem("CCCD"),
    }
    fetch(`${BACKEND_URL}/api/createCharityOrg`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orgData)
    })
        .then(response => {
                if (response.ok) {
                    return response.json().then(responseJSON => {
                        if(responseJSON.error===1)
                        {
                            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa feedback.');
                        }
                        alert("Đăng ký mở tổ chức thành công!");
                        window.location.href ="/Pages/personal.html";
                    })
                } else {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Đã xảy ra lỗi khi đăng ký mở tổ chức.');
                    });
                }
            }
        )
        .catch(error => {
            alert("Đăng ký mở tổ chức thất bại. \n" + error.message);
            window.location.href ="/Pages/personal.html";
        });
}

function syncOrgCharityCProfile(search_keyword){
    if (!search_keyword) {return;}
    let orgName = document.getElementById("orgName");
    let orgId = document.getElementById("orgId");
    let contractInfo = document.getElementById("contractInfo");
    let license = document.getElementById("license");

    if (
        !orgName || !orgId || !contractInfo || !license
    ) {
        return;
    }
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCharityOrgByKey?search_keyword=${encodeURIComponent(search_keyword)}`;
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

                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                    }
                    let data=responseJSON.orgData;
                    if(!data)
                    {
                        alert("Không tìm thấy thông tin tổ chức. \n");
                        window.location.href ="/Pages/personal.html";
                    }
                    orgName.value = data.orgname;
                    orgId.value = data.orgId;
                    contractInfo.value = data.contractInfo;
                    license.value = data.license;
                    orgId.disabled=true;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin tổ chức. \n" + errorData.message);

                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin tổ chức.\n" + error.message);

    });
}

function updateOrgCharity(search_keyword){

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    const orgData={
        orgId:search_keyword,
        orgname:document.getElementById("orgName").value,
        contractInfo: document.getElementById("contractInfo").value,
        license: document.getElementById("license").value,
    }
    fetch(`${BACKEND_URL}/api/updateCharityOrg`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orgData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi cập nhật tổ chức.');
                });
            }
        }).then(responseJSON => {
        console.log('responseJSON: ',responseJSON);
        if (responseJSON.error === 1) {
            alert("Cập nhật tổ chức thất bại.");
            window.location.href ="/Pages/personal.html";
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật tổ chức.');
        }
        alert("Cập nhật tổ chức thành công!\n"+responseJSON.message);
    })
        .catch(error => {
            alert("Cập nhật tổ chức thất bại. \n" + error.message);
            window.location.href ="/Pages/personal.html";
        });
}

function getOrgReport(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getReports?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy các báo cáo.');
                    }
                    const data=responseJSON.Reports;
                    populateOrgReportTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('report-paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getOrgReport('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getOrgReport('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getOrgReport('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy các báo cáo. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy các báo cáo.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy các báo cáo.\n" + error.message);
})
}

function populateOrgReportTable(data) {

    const tableBody = document.getElementById('reports-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach((report, index) => {

        const createDateFormatted = new Date(report.createdAt).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index+1}</td>
      <td>${report.orgId}</td>
      <td>${report.cccdAmin}</td>
      <td>${report.remaining}</td>
      <td>${report.damages}</td>
      <td>${report.budget}</td>
      <td>${report.comment}</td>
      <td>${createDateFormatted}</td>
      <td>
<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteOrgReport('${report.id}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function confirmDeleteOrgReport(id) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
    if (isConfirmed) {
        deleteOrgReport(id);
    }
}

function deleteOrgReport(id) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteReport`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
            id: id
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa report.');
                }
                alert("Xóa report thành công" + responseJSON.message);
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


function checkValidComment()
{
    const Input = document.getElementById("comment");
    const Error = document.getElementById("comment-error");
    const reportButton = document.getElementById("finalButton-report");
    reportButton.disabled = true;
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){
            Error.textContent  = "Nội dung báo cáo không được bỏ trống.";
            reportButton.disabled = true;
        }
        else{
            Error.textContent  = null;
            reportButton.disabled=false;
        }
    });
}
checkValidComment()

function syncReportProfile(search_keyword){
    if (!search_keyword) {return;}

    let campaignRemaining=document.getElementById("campaignRemaining");
    let campaignBudget=document.getElementById("campaignBudget");
    let campaignDamages=document.getElementById("campaignDamages");

    if (!campaignRemaining || !campaignBudget || !campaignDamages) {
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
                        window.location.href ="/Pages/personal.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin chiến dịch.');
                    }
                    const data=responseJSON.data;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu thông tin chiến dịch.");
                        throw new Error('Không có dữ liệu thông tin chiến dịch.');
                    }
                    campaignRemaining.value = data[0].remaining;
                    campaignRemaining.disabled=true;
                    campaignBudget.value = data[0].budget;
                    campaignBudget.disabled=true;
                    campaignDamages.value = data[0].damages;
                    campaignDamages.disabled=true;
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


function createReport(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    const comment = document.getElementById("comment").value;

    let reportData={
        orgId: sessionStorage.getItem("orgId"),
        cccdAmin:sessionStorage.getItem("CCCD"),
        remaining: document.getElementById("campaignRemaining").value,
        damages:document.getElementById("campaignDamages").value,
        budget:document.getElementById("campaignBudget").value,
        comment:comment
    }
    fetch(`${BACKEND_URL}/api/createReport`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
    })
        .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        if (data.error === 1) {
                            alert("Tạo report thất bại. \n" + data.message);
                        }
                        alert("Tạo report thành công!\n");
                        getOrgReport(orgId,1);
                        comment.value='';
                    });
                } else {
                    return response.json().then(error => {
                        alert("Tạo report thất bại. \n" + error.message);
                    });
                }
            }
        ).catch(error => {
            alert("Tạo report thất bại. \n" + error.message);
        });
}
