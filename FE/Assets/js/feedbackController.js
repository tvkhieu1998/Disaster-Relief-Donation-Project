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






function getAllFeedback(page){
    if(page===0) return;
    let search_keyword='';
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
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllFeedback(${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getAllFeedback(${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getAllFeedback(${nextPage})"> Tiếp >>></a>`;
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
    `;
        tableBody.appendChild(row);
    });

}


function checkValidRating()
{
    const Input = document.getElementById("rating");
    const Error = document.getElementById("rating-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Điểm đánh giá không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

function checkValidComment()
{
    const Input = document.getElementById("comment");
    const Error = document.getElementById("comment-error");
    if (!Input||!Error) return;
    Input.addEventListener("blur",() => {
        if(Input.value.trim() === ""){Error.textContent  = "Nhận xét không được bỏ trống.";}
        else{Error.textContent  = null;}
    });
}

//Check all input fields:
checkValidRating();
checkValidComment();


function createFeedback(roleCode,senderCCCD){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    let feedbackData;
    const rating = isNaN(parseInt(document.getElementById("rating").value, 10)) ? 0 : parseInt(document.getElementById("rating").value, 10);
    const comment = document.getElementById("comment").value;

    if(roleCode==="4"){
        feedbackData={
            isVictim: true,
            victimCCCD:senderCCCD,
            rating: rating,
            comment:comment
        }
    }
    else{
        feedbackData={
            isVictim: false,
            userCCCD:senderCCCD,
            rating: rating,
            comment:comment
        }
    }
    fetch(`${BACKEND_URL}/api/createFeedback`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    if (data.error === 1) {
                        alert("Tạo feedback thất bại. \n" + data.message);
                        return null;
                    }
                    alert("Tạo feedback thành công.");
                    getAllFeedback(1);
                    return data;
                });
            } else {
                return response.json().then(error => {
                    alert("Tạo feedback thất bại. \n" + error.message);
                });
            }
            }
        ).catch(error => {
            alert("Tạo feedback thất bại. \n" + error.message);
        });
}