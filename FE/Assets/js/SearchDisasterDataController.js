function getDisasters(search_keyword,page){
    if(page===0) return;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai');
                    }
                    const data=responseJSON.disasters;

                    populateDisasterTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getDisasters('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getDisasters('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getDisasters('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin thiên tai. \n" + error.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                });
            }
        }).catch(error => {
        console.error("Error fetching disaster:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin thiên tai.\n" + error.message);
    });
}

function populateDisasterTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(disaster => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${disaster.disasterId}</td>
      <td>${disaster.description}</td>
      <td><!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateDisaster('${disaster.disasterId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteDisaster('${disaster.disasterId}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function confirmDeleteDisaster(disasterId) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa thiên tai này?");
    if (isConfirmed) {
        adminDeleteDisaster(disasterId);
    }
}


function adminDeleteDisaster(disasterId) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteDisaster`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
            disasterId: disasterId
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa thiên tai.');
                }
                alert("Xóa thiên tai thành công" + responseJSON.message);
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

function syncDisasterProfile(search_keyword){
    if (!search_keyword) {return;}

    let disasterNameTitle= document.getElementById("disasterNameTitle");
    let disasterId= document.getElementById("disasterId");
    let description=document.getElementById("description");

    if (!disasterId || !description || !disasterNameTitle ) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/getDisasterByKey?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(1)}`;

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
                        window.location.href ="/Pages/adminDisasterManagement.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                    }
                    const data=responseJSON.disasters;
                    if (!data || data.length === 0) {
                        alert("Không có dữ liệu thông tin thiên tai.");
                        window.location.href ="/Pages/adminDisasterManagement.html";
                        throw new Error('Không có dữ liệu thông tin thiên tai.');
                    }

                    disasterNameTitle.innerHTML=data[0].disasterId;
                    disasterId.value=data[0].disasterId;
                    disasterId.disabled=true;

                    description.value = data[0].description;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin thiên tai. \n" + errorData.message);
                    window.location.href ="/Pages/adminDisasterManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin thiên tai.');
                });
            }
        }).catch(error => {
        console.error("Error fetching disaster:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin thiên tai.\n" + error.message);
        window.location.href ="/Pages/adminDisasterManagement.html";
    });
}

function syncUpdateDisaster(disasterId) {
    const updateForm = document.getElementById('updateDisasterForm');
    updateForm.classList.toggle('d-none');
    syncDisasterProfile(disasterId);
}

function adminUpdateDisaster(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        disasterId:document.getElementById("disasterId").value,
        description:document.getElementById("description").value
    };

    fetch(`${BACKEND_URL}/api/updateDisaster`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật thiên tai.');
                }
                const data= responseJSON.data
                syncDisasterProfile(data.disasterId);
                alert("Cập nhật thiên tai thành công. \n");
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




function handleButtonCreate(){
    const createDisasterForm = document.getElementById('createDisasterForm');
    console.log(createDisasterForm);
    createDisasterForm.classList.toggle('d-none');
}

function checkValidDisasterId()
{
    const Input = document.getElementById("disasterIdNew");
    const Error = document.getElementById("disasterIdNew-error");
    const finalButtonCreate = document.getElementById("finalButtonCreate");

    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){
            Error.textContent  = "Tên thiên tai không được bỏ trống.";
        }
        else{
            Error.textContent  = null;
        }
        toggleFinalButton()
    });
}

function checkValidDisasterDescription()
{
    const Input = document.getElementById("descriptionNew");
    const Error = document.getElementById("descriptionNew-error");
    const finalButtonCreate = document.getElementById("finalButtonCreate");

    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){
            Error.textContent  = "Miêu tả không được bỏ trống.";
        }
        else{
            Error.textContent  = null;
        }
        toggleFinalButton()
    });
}
function toggleFinalButton() {
    const disasterIdError = document.getElementById("disasterIdNew-error").textContent.trim();
    const descriptionError = document.getElementById("descriptionNew-error").textContent.trim();
    const finalButtonCreate = document.getElementById("finalButtonCreate");

    finalButtonCreate.disabled = !(disasterIdError === "" && descriptionError === "");
}

checkValidDisasterId();
checkValidDisasterDescription();

function adminCreateDisaster(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        disasterId:document.getElementById("disasterIdNew").value,
        description:document.getElementById("descriptionNew").value
    };

    fetch(`${BACKEND_URL}/api/createDisaster`, {
        method: 'POST',
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi tạo mới thiên tai.');
                }
                alert("Tạo mới thiên tai thành công. \n");
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi tạo mới. \n" + errorData.message);
            });
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi tạo mới.\n" + error.message);
    });
}