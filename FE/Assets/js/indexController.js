function getNewsfeed(search_keyword,page){
    if(page===0) return;

    const loading=document.getElementById("loading");
    const loaded=document.getElementById("newsfeed-result");

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/getNewsfeed?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;

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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                    }
                    const data=responseJSON.Feedbacks;

                    loading.classList.add('d-none');
                    loaded.classList.remove('d-none');

                    populateNewsfeedTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('newsfeed-paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getNewsfeed('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getNewsfeed('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getNewsfeed('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin bài báo. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin bài báo.\n" + error.message);
    });
}

function populateNewsfeedTable(data) {

    const tableBody = document.getElementById('newsfeed-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach((newsfeed, index) => {

        const row = document.createElement('div');
        row.classList.add('mb-3', 'd-flex', 'align-items-start');
        row.innerHTML = `
      <img src="${newsfeed.thumbnails}" alt="" class="me-3 rounded img-thumbnail">
                    <div>
                        <h5><a href="/Pages/readDetailNewsfeed.html?NewsfeedId=${newsfeed.id}" class="text-decoration-none text-primary">${newsfeed.title}</a></h5>
                        <p class="card-text">${newsfeed.summary}</p>
                        <p class="card-text fst-italic">Nguồn: ${newsfeed.newsAgency.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
                    </div>
    `;
        tableBody.appendChild(row);
    });
}

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

                    const paging = document.getElementById('heatmap-paging');
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

    const tableBody = document.getElementById('heatmap-result');
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
<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="goToLocation('${heatmap.latitude}','${heatmap.longitude}','${heatmap.severityId}','${heatmap.name}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 20 20">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg> Xem
</button></td>
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