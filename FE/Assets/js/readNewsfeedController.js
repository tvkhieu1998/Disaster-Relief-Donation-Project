function syncNewsfeedProfile(search_keyword){
    if (!search_keyword) {return;}

    const loading=document.getElementById("loading");
    const loaded=document.getElementById("loaded");
    const title=document.getElementById("title");
    const updateDate = document.getElementById("updateDate");
    const content = document.getElementById("content");

    if (!title || !updateDate || !content) {
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
                        window.location.href ="/index.html";
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                    }
                    const data=responseJSON.Newsfeed;
                    if (!data) {
                        alert("Không có dữ liệu thông tin bài báo.");
                        window.location.href ="/index.html";
                        throw new Error('Không có dữ liệu thông tin bài báo.');
                    }
                    title.innerHTML=data.title;

                    updateDate.innerHTML=new Date(data.updatedAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });

                    content.innerHTML=data.content;
                    loading.classList.add('d-none');
                    loaded.classList.remove('d-none');

                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin bài báo. \n" + errorData.message);
                    window.location.href ="/index.html";
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin bài báo.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin bài báo.\n" + error.message);
        window.location.href ="/index.html";
    });
}

function getNewsfeedComments(search_keyword,page){
    if(page===0) return;

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    const url = `${BACKEND_URL}/api/getNewsfeedComments?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;

    console.log(url);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(responseJSON => {
                    if(responseJSON.error===1)
                    {
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin bình luận.');
                    }
                    const data=responseJSON.Comments;

                    populateNewsfeedCommentTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('comment-paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getNewsfeedComments('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getNewsfeedComments('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getNewsfeedComments('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin bình luận. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin bình luận.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin bình luận.\n" + error.message);
    });
}

function populateNewsfeedCommentTable(data) {

    const tableBody = document.getElementById('comments-list');
    let UserEmail = sessionStorage.getItem('email');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(comment => {

        const dateFormatted = new Date(comment.createdAt).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const row = document.createElement('div');
        row.classList.add('mb-2', 'card');

        if(comment.userEmail===UserEmail)
        {
            row.innerHTML = `
      <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${comment.userEmail}</h5>
                                <p class="card-text">${comment.comment}</p>
                                <small class="text-muted">${dateFormatted}</small>
                                <a href="javascript:void(0)" class="text-danger d-block text-end" onclick="deleteComment('${comment.id}','${comment.newsfeedId}')">Xóa comment</a>
                            </div>
                        </div>
      `;
            tableBody.appendChild(row);
        }
        else{
            row.innerHTML = `
      <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${comment.userEmail}</h5>
                                <p class="card-text">${comment.comment}</p>
                                <small class="text-muted">${dateFormatted}</small>
                            </div>
                        </div>
      `;
            tableBody.appendChild(row);
        }

    });
}

function checkValidComment()
{
    const Input = document.getElementById("comment");
    const Error = document.getElementById("comment-error");
    const sendCommentButton = document.getElementById("send-comment-button");

    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){
            Error.textContent  = "Comment không được bỏ trống.";
            sendCommentButton.disabled = true;
        }
        else{
            Error.textContent  = null;
            sendCommentButton.disabled = false;
        }
    });
}
checkValidComment()

function createComment(newsfeedId,UserEmail,comment){

    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';




    if(!newsfeedId||!UserEmail||!comment)
    {
        alert("Lỗi khi tạo comment, vui lòng điền đầy đủ thông tin.");
        return;
    }


    const updateData = {
        newsfeedId:newsfeedId,
        userEmail:UserEmail,
        comment:comment,
    };

    fetch(`${BACKEND_URL}/api/createNewsfeedComment`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi tạo mới comment.');
                }
                alert("Tạo mới bình luận thành công. \n");
                getNewsfeedComments(newsfeedId);
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

function deleteComment(id,newsfeedId) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteNewsfeedComment`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa comment.');
                }
                alert("Xóa comment thành công\n" + responseJSON.message);
                getNewsfeedComments(newsfeedId);
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi xóa comment. \n" + errorData.message);
            });
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xóa comment.\n" + error.message);
    });
}