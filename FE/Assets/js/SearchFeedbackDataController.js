async function getFeedbackStatistic(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');


    const url = `${BACKEND_URL}/api/getFeedbackStatistic`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu feedback.');
        }

        const responseJSON = await response.json();

        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy feedback.');
        }

        const feedbacks = responseJSON.Feedbacks;
        const feedbackStatitic = [];
        feedbacks.forEach(feedback => {
            const date = feedback.createdAt.split("T")[0];
            const rating = feedback.rating;

            let existing = feedbackStatitic.find(item => item.date === date);
            if (existing) {

                existing.rating = ((existing.rating * existing.count) + rating) / (existing.count + 1);
                existing.count += 1;
            } else {
                feedbackStatitic.push({
                    date: date,
                    rating: rating,
                    count: 1
                });
            }
        });
        return feedbackStatitic;

    } catch (error) {
        console.error('Lỗi khi lấy feedbackStatistic:', error);
        throw new Error(error.message);
    }
}


function getAllFeedback(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getFeedbacks?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin feedback.');
                    }
                    const data=responseJSON.Feedbacks;
                    populateFeedbackTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllFeedback('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllFeedback('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAllFeedback('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }

                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy feedback. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy feedback.');
                });
            }
        }).catch(error => {
        console.error("Error fetching:", error.message);
        alert("Đã xảy ra lỗi khi lấy feedback.\n" + error.message);
    });
}

function populateFeedbackTable(data) {

    const tableBody = document.getElementById('feedback-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';

    tableBody.innerHTML = '';
    data.forEach((feedback, index) => {
        let feedbackRole=feedback.isVictim ? "Nạn nhân" : "Người dùng";
        const dateFormatted = new Date(feedback.createdAt).toLocaleString('vi-VN', {
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
      <td>${feedbackRole}</td>
      <td>${feedback.rating}</td>
      <td>${feedback.comment}</td>
      <td>${dateFormatted}</td>
      <td>
<!-- Button for Delete (Trash icon) -->
<button class="btn btn-link" onclick="confirmDeleteFeedback('${feedback.id}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 20 20">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });

}

function confirmDeleteFeedback(data) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn feedback này?");
    if (isConfirmed) {
        adminDeleteFeedback(data);
    }
}


function adminDeleteFeedback(data) {
    const Authorization=sessionStorage.getItem('Access_Token');
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    fetch(`${BACKEND_URL}/api/deleteFeedback`, {
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
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa feedback.');
                }
                alert("Xóa feedback thành công\n" + responseJSON.message);
                location.reload();
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