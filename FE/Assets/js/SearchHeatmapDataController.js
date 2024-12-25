function getHeatmap(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getHeatmap?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
    console.log(url);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(responseJSON => {
                    if(responseJSON.error===1)
                    {
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin heatmap.');
                    }
                    const data=responseJSON.Heatmaps;
                    populateHeatmapTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getHeatmap('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getHeatmap('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getHeatmap('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }

                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy heatmap. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy heatmap.');
                });
            }
        }).catch(error => {
        console.error("Error fetching:", error.message);
        alert("Đã xảy ra lỗi khi lấy heatmap.\n" + error.message);
    });
}

function populateHeatmapTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';

    tableBody.innerHTML = '';
    data.forEach((heatmap, index) => {
        const dateFormatted = new Date(heatmap.updatedAt).toLocaleString('vi-VN', {
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
      <td>${heatmap.disasterId}</td>
      <td>${heatmap.name}</td>
      <td>${heatmap.description}</td>
      <td>${heatmap.severityId}</td>
      <td>${dateFormatted}</td>
      <td>
<!-- Button for Watch -->
<button class="btn btn-link" onclick="goToLocation('${heatmap.latitude}','${heatmap.longitude}','${heatmap.severityId}','${heatmap.name}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 20 20">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>
</button>

<!-- Button for Edit -->
<button class="btn btn-link" onclick="syncUpdateHeatmap('${heatmap.id}','${heatmap.latitude}','${heatmap.longitude}','${heatmap.name}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete -->
<button class="btn btn-link" onclick="confirmDeleteHeatmap('${heatmap.id}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button>

</td>
    `;
        tableBody.appendChild(row);
    });
}

function goToLocation(latitude,longitude,severityId,lable)
{
    const target = document.getElementById('map');
    target.scrollIntoView({ behavior: 'smooth' });
    drawMap(severityId, latitude, longitude,lable);
    setMapView(latitude, longitude);
}

function confirmDeleteHeatmap(data) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa vị trí này?");
    if (isConfirmed) {
        adminDeleteHeatmap(data);
    }
}
function adminDeleteHeatmap(data) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteHeatmap`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
            id: data
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa heatmap.');
                }
                alert("Xóa heatmap thành công\n" + responseJSON.message);
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

async function syncUpdateHeatmap(id, latitude, longitude,lable) {
    const updateForm = document.getElementById('updateHeatmapForm');
    updateForm.classList.toggle('d-none');
    syncHeatmapProfile(id);
    await initializeMapUpdate(latitude, longitude,lable);
}
function syncHeatmapProfile(search_keyword){
    if (!search_keyword) {return;}
    let heatmapNameTitle=document.getElementById("heatmapNameTitle");
    let heatmapId=document.getElementById("heatmapId");

    let disasterId=document.getElementById("disasterId");
    let heatmapName=document.getElementById("heatmapName");
    let heatmapDesc=document.getElementById("heatmapDesc");
    let heatmapLatitude= document.getElementById("heatmapLatitude");
    let heatmapLongitude= document.getElementById("heatmapLongitude");
    let heatmapSeverityId= document.getElementById("heatmapSeverityId");

    if (!heatmapId || !disasterId || !heatmapName || !heatmapDesc  || !heatmapLatitude || !heatmapLongitude|| !heatmapSeverityId) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/getHeatmapByPK?search_keyword=${encodeURIComponent(search_keyword)}`;

    const Authorization=sessionStorage.getItem('Access_Token');//

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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin heatmap.');
                    }
                    const data=responseJSON.Heatmap;

                    heatmapNameTitle.innerHTML=data.name;
                    heatmapId.value=data.id;
                    heatmapId.disabled=true;

                    disasterId.value=data.disasterId;
                    heatmapName.value = data.name;

                    heatmapDesc.value = data.description;

                    heatmapLatitude.value=data.latitude;
                    heatmapLongitude.value = data.longitude;

                    heatmapSeverityId.value = data.severityId;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin heatmap. \n" + errorData.message);
                    window.location.href ="/Pages/adminHeatmapManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin heatmap.');
                });
            }
        }).catch(error => {
        console.error("Error fetching heatmap:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin heatmap.\n" + error.message);
        window.location.href ="/Pages/adminHeatmapManagement.html";
    });
}

function adminUpdateHeatmapData(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        id:document.getElementById("heatmapId").value,
        disasterId:document.getElementById("disasterId").value,
        name: document.getElementById("heatmapName").value,
        description: document.getElementById("heatmapDesc").value,
        latitude: document.getElementById("heatmapLatitude").value,
        longitude: document.getElementById("heatmapLongitude").value,
        severityId: document.getElementById("heatmapSeverityId").value,
        CCCDAdmin: sessionStorage.getItem('CCCD')
    };

    console.log('update data: ',updateData);

    fetch(`${BACKEND_URL}/api/updateHeatmap`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật heatmap.');
                }
                const data= responseJSON.data
                syncHeatmapProfile(data.id);
                alert("Cập nhật heatmap thành công. \n");
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

async function handleButtonCreate() {
    const createHeatmapForm = document.getElementById('createHeatmapForm');
    createHeatmapForm.classList.toggle('d-none');
    getAllDisater(1);
    await initializeMapCreate(16.047079, 108.206230, 'Chọn vị trí:');
}

function adminCreateHeatmap(){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    let disasterId=document.getElementById("disasterIdNew").value;
    let name= document.getElementById("heatmapNameNew").value;
    let description= document.getElementById("heatmapDescNew").value;
    let latitude= document.getElementById("heatmapLatitudeNew").value;
    let longitude= document.getElementById("heatmapLongitudeNew").value;
    let severityId= document.getElementById("heatmapSeverityIdNew").value;
    let CCCDAdmin= sessionStorage.getItem('CCCD');
    if (!disasterId || !name || !description || !latitude || !longitude || !severityId) {
        alert("Các trường có dấu * không được bỏ trống.");
        return;
    }

    const createData = {
        disasterId,
        name,
        description,
        latitude,
        longitude,
        severityId,
        CCCDAdmin
    };
    console.log('Create date ', createData);

    fetch(`${BACKEND_URL}/api/createHeatmap`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify(createData),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi tạo mới heatmap.');
                }
                alert("Tạo mới heatmap thành công. \n");
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

                    const paging = document.getElementById('disasters-paging');
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