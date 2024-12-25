function getAccounts(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/accounts?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;

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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
                    }
                    const data=responseJSON.UserData;

                    populateUserTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAccounts('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAccounts('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAccounts('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin người dùng. \n" + error.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin người dùng.\n" + error.message);
    });
}

function populateUserTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(user => {
        const roleName = getRoleName(user.roleId);
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.cccd}</td>
      <td>${user.name}</td>
      <td>${user.phoneNumber}</td>
      <td>${user.age}</td>
      <td>${roleName}</td>
      <td>${user.address}</td>
      <td><!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateAccount(${ user.cccd})">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteAccount(${ user.cccd})">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function getRoleName(roleId) {
    let roleName = '';
    switch (roleId) {
        case 1:
            roleName = 'Quản trị viên';
            break;
        case 2:
            roleName = 'Người dùng';
            break;
        case 3:
            roleName = 'Tổ chức từ thiện';
            break;
        case 4:
            roleName = 'Nạn nhân';
            break;
        default:
            roleName = 'Chưa xác định';
    }
    return roleName;
}


function confirmDeleteAccount(cccd) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
    if (isConfirmed) {
        adminDeleteAccount(cccd);
    }
}


function adminDeleteAccount(CCCD) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/delete-account`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
            cccd: CCCD,
            confirmation: true
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa người dùng.');
                }
                alert("Xóa tài khoản thành công" + responseJSON.message);
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

function syncAccountCProfile(search_keyword){
    if (!search_keyword) {return;}
    let userEmailTitle=document.getElementById("userEmail");
    let cccd=document.getElementById("cccd");
    let email=document.getElementById("email");
    let name=document.getElementById("name");
    let phoneNumber= document.getElementById("phoneNumber");
    let accountRole= document.getElementById("accountRole");
    let accountStatus= document.getElementById("accountStatus");
    let age= document.getElementById("age");
    let address=document.getElementById("address");

    if (!cccd || !email || !name || !phoneNumber  || !accountRole || !accountStatus || !age || !address) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/accounts?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(1)}`;

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
                        window.location.href ="/Pages/adminUserManagement.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
                    }
                    const data=responseJSON.UserData;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu thông tin người dùng.");
                        window.location.href ="/Pages/adminUserManagement.html";
                        throw new Error('Không có dữ liệu thông tin người dùng.');
                    }

                    userEmailTitle.innerHTML=data[0].email;
                    cccd.value=data[0].cccd;
                    email.value=data[0].email;
                    cccd.disabled=true;
                    email.disabled=true;


                    name.value = data[0].name;
                    phoneNumber.value = data[0].phoneNumber;
                    accountRole.value=data[0].roleId;
                    accountStatus.value = data[0].isActive;
                    age.value = data[0].age;
                    address.value = data[0].address;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin người dùng. \n" + errorData.message);
                    window.location.href ="/Pages/adminUserManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin người dùng.\n" + error.message);
        window.location.href ="/Pages/adminUserManagement.html";
    });
}

function syncUpdateAccount(userCCCD) {
    const updateForm = document.getElementById('updateUserForm');
    updateForm.classList.toggle('d-none');
    syncAccountCProfile(userCCCD);
}

function adminUpdateAccount(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        cccd:document.getElementById("cccd").value,
        email:document.getElementById("email").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        roleId: document.getElementById("accountRole").value,
        isActive: document.getElementById("accountStatus").value,
        age: document.getElementById("age").value,
        address: document.getElementById("address").value
    };

    console.log('update data: ',updateData);

    fetch(`${BACKEND_URL}/api/update-account`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật người dùng.');
                }
                const data= responseJSON.UserData
                syncAccountCProfile(data.cccd);
                alert("Cập nhật người dùng thành công. \n");
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
