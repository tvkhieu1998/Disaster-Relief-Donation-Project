function getNewsfeed(search_keyword,page){
    if(page===0) return;
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
                    populateNewsfeedTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
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

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach((newsfeed, index) => {

        const dateFormatted = new Date(newsfeed.updatedAt).toLocaleString('vi-VN', {
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
      <td>${newsfeed.title}</td>
      <td>${newsfeed.articleUrl}</td>
      <td>${newsfeed.summary}</td>
      <td>${dateFormatted}</td>
      <td><!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateNewsfeed('${newsfeed.id}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 20 20">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
  </svg>
</button>

<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteNewsfeed('${newsfeed.id}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function syncUpdateNewsfeed(data) {
    const updateForm = document.getElementById('updateNewsForm');
    updateForm.classList.toggle('d-none');
    syncNewsfeedProfile(data);
}

function syncNewsfeedProfile(search_keyword){
    if (!search_keyword) {return;}
    let NewsNameTitle=document.getElementById("NewsNameTitle");
    const newsfeedId = document.getElementById("newsfeedId");
    const newsAgency = document.getElementById("newsAgency");
    const title = document.getElementById("title");
    const articleUrl = document.getElementById("articleUrl");
    const thumbnails = document.getElementById("thumbnails");
    const summary = document.getElementById("summary");
    const content = document.getElementById("content");

    if (!newsfeedId || !newsAgency || !title || !articleUrl  || !thumbnails || !summary || !content) {
        return;
    }

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const url = `${BACKEND_URL}/api/getNewsfeedByPK?search_keyword=${encodeURIComponent(search_keyword)}`;

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
                        window.location.href ="/Pages/adminNewsfeedManagement.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                    }
                    const data=responseJSON.Newsfeed;
                    if (!data) {
                        alert("Không có dữ liệu thông tin bài báo.");
                        window.location.href ="/Pages/adminNewsfeedManagement.html";
                        throw new Error('Không có dữ liệu thông tin bài báo.');
                    }

                    NewsNameTitle.innerHTML=data.title;

                    newsfeedId.value=data.id;
                    newsAgency.value = data.newsAgency;
                    title.value = data.title;
                    articleUrl.value=data.articleUrl;
                    thumbnails.value = data.thumbnails;
                    summary.value = data.summary;
                    content.innerHTML=data.content;
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin bài báo. \n" + errorData.message);
                    window.location.href ="/Pages/adminNewsfeedManagement.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin bài báo.\n" + error.message);
        window.location.href ="/Pages/adminNewsfeedManagement.html";
    });
}

function adminUpdateNewsfeedData(){

    const Authorization=sessionStorage.getItem('Access_Token');

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    const updateData = {
        id:document.getElementById("newsfeedId").value,
        newsAgency:document.getElementById("newsAgency").value,
        title: document.getElementById("title").value,
        articleUrl: document.getElementById("articleUrl").value,
        thumbnails: document.getElementById("thumbnails").value,
        summary: document.getElementById("summary").value,
        content: document.getElementById("content").innerHTML
    };

    console.log('update data: ',updateData);

    fetch(`${BACKEND_URL}/api/updateNewsfeed`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật bài báo.');
                }
                const data= responseJSON.data
                syncNewsfeedProfile(data.id);
                alert("Cập nhật bài báo thành công. \n");
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


function confirmDeleteNewsfeed(data) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa bài báo này?");
    if (isConfirmed) {
        adminDeleteNewfeed(data);
    }
}

function adminDeleteNewfeed(data) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteNewsfeed`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa bài báo.');
                }
                alert("Xóa bài báo thành công\n" + responseJSON.message);
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