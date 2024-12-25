function getCharityOrgs(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/charityOrgs?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;

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
                    const data=responseJSON.OrgData;
                    populateCharityOrgTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getCharityOrgs('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getCharityOrgs('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getCharityOrgs('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
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

function populateCharityOrgTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(org => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${org.orgId}</td>
      <td>${org.orgname}</td>
      <td>${org.contractInfo}</td>
      <td>${org.license}</td>
      <td>${org.isVerify === true ? "Xác thực" : "Chưa xác thực"}</td>
      <td>${org.cccd || 'Không'}</td>
      <td><!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateOrg('${org.orgId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteOrg('${org.orgId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function confirmDeleteOrg(data) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn tổ chức khoản này?");
    if (isConfirmed) {
        adminDeleteOrg(data);
    }
}


function adminDeleteOrg(data) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteCharityOrg`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa tổ chức.');
                }
                alert("Xóa tổ chức thành công\n" + responseJSON.message);
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

function syncOrgProfile(search_keyword){
    if (!search_keyword) {return;}
    let orgNameTitle=document.getElementById("orgNameTitle");
    let orgId=document.getElementById("orgId");
    let orgName=document.getElementById("orgName");
    let contractInfo=document.getElementById("contractInfo");
    let license= document.getElementById("license");
    let orgStatus= document.getElementById("orgStatus");
    let cccdOrg= document.getElementById("cccdOrg");

    if (!orgId || !orgName || !contractInfo || !license  || !orgStatus || !cccdOrg) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/charityOrgs?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(1)}`;

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
                        window.location.href ="/Pages/adminOrgManagement.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                    }
                    const data=responseJSON.OrgData;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu thông tin tổ chức.");
                        window.location.href ="/Pages/adminOrgManagement.html";
                        throw new Error('Không có dữ liệu thông tin tổ chức.');
                    }

                    orgNameTitle.innerHTML=data[0].orgname;
                    orgId.value=data[0].orgId;

                    orgId.disabled=true;

                    orgName.value=data[0].orgname;
                    contractInfo.value = data[0].contractInfo;
                    license.value = data[0].license;
                    orgStatus.value=data[0].isVerify;
                    cccdOrg.value = data[0].cccd;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin tổ chức. \n" + errorData.message);
                    window.location.href ="/Pages/adminOrgManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin tổ chức.\n" + error.message);
        window.location.href ="/Pages/adminOrgManagement.html";
    });
}

function syncUpdateOrg(data) {
    const updateForm = document.getElementById('updateOrgForm');
    updateForm.classList.toggle('d-none');
    syncOrgProfile(data);
}

function adminUpdateOrgData(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        orgId:document.getElementById("orgId").value,
        orgname:document.getElementById("orgName").value,
        contractInfo: document.getElementById("contractInfo").value,
        license: document.getElementById("license").value,
        isVerify: document.getElementById("orgStatus").value,
        cccd: document.getElementById("cccdOrg").value.trim() || null
    };

    console.log('update data: ',updateData);

    fetch(`${BACKEND_URL}/api/updateCharityOrg`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật tổ chức.');
                }
                const data= responseJSON.data
                syncOrgProfile(data.orgId);
                alert("Cập nhật tổ chức thành công. \n");
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
