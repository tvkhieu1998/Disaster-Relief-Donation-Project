async function getNewsTitle(search_keyword) {
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    const TitleData = {
        url :search_keyword
    };

    const url = `${BACKEND_URL}/api/getTitles`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TitleData),
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu newstitle.');
        }

        const responseJSON = await response.json();

        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy newstitle.');
        }
        const data=responseJSON.newsTitles;
        populateNewstitleTable(data);

    } catch (error) {
        console.error('Lỗi khi lấy newstitle:', error);
        throw new Error(error.message);
    }
}

function populateNewstitleTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';

    tableBody.innerHTML = '';
    data.forEach((title, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      
      <td>${index+1}</td>
      <td>${title.title}</td>
      <td>${title.articleUrl}</td>
      <td>${title.thumbnails}</td>
      <td>${title.summary}</td>
      <td>
      <!-- Button for Edit (Pencil icon) -->
<button class="btn btn-link" onclick="syncUpdateNewstitle('${title.title}','${title.articleUrl}','${title.thumbnails}','${title.summary}')">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-floppy-fill" viewBox="0 0 20 20">
  <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
  <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
</svg>
</button></td>
    `;
        tableBody.appendChild(row);
    });
}

function syncUpdateNewstitle(titleData,articleUrlData,thumbnailsData,summaryData) {
    const updateForm = document.getElementById('updateNewsForm');
    updateForm.classList.toggle('d-none');

    let NewsNameTitle=document.getElementById("NewsNameTitle");
    const title = document.getElementById('title');
    const articleUrl = document.getElementById('articleUrl');
    const thumbnails = document.getElementById('thumbnails');
    const summary = document.getElementById('summary');
    const content = document.getElementById('content');

    if(!title||!articleUrl||!thumbnails||!summary||!content)
    {return;}
    content.innerHTML='';
    NewsNameTitle.innerHTML=titleData
    title.value=titleData;
    articleUrl.value=articleUrlData;
    thumbnails.value=thumbnailsData
    summary.value=summaryData;
}

async function getNewsContent()
{
    const newsAgency = document.getElementById('newsAgency');
    const articleUrl = document.getElementById('articleUrl');
    const content = document.getElementById('content');
    if(!newsAgency || !articleUrl || !content)
    {return;}

    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    const ContentData = {
        newsUrl :newsAgency.value,
        articleUrl :articleUrl.value,
    };

    const url = `${BACKEND_URL}/api/getContent`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ContentData),
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu content.');
        }

        const responseJSON = await response.json();

        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy content.');
        }
        const data=responseJSON.newsContent;

        if(data.description.length>0)
        {
            data.description.forEach((item) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = item;
                content.appendChild(paragraph);
            });
        }

        if (data.images.length > 0) {
            data.images.forEach((item, index) => {
                const figure = document.createElement('figure');

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = `Image ${index + 1}`;

                img.classList.add('me-3', 'rounded', 'img-thumbnail', 'content-image');

                const caption = document.createElement('figcaption');
                caption.textContent = item.caption;

                figure.appendChild(img);
                figure.appendChild(caption);

                content.appendChild(figure);
            });
        }

    } catch (error) {
        console.error('Lỗi khi lấy content:', error);
        throw new Error(error.message);
    }
}

function createNewsfeed(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');
    const newsAgency = document.getElementById("newsAgency").value;
    const title = document.getElementById("title").value;
    const articleUrl = document.getElementById("articleUrl").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const summary = document.getElementById("summary").value;
    const content = document.getElementById("content").innerHTML;
    if (!newsAgency || !title || !articleUrl || !thumbnails  || !summary || !content) {
        alert("Các trường có dấu * không được bỏ trống.");
        return;
    }

    let newsfeedData={
        newsAgency,
        title,
        articleUrl,
        thumbnails,
        summary,
        content
    }
    fetch(`${BACKEND_URL}/api/createNewsfeed`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsfeedData)
    })
        .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        if (data.error === 1) {
                            alert("Tạo bài báo thất bại. \n" + data.message);
                            throw new Error(data.message || 'Tạo bài báo thất bại.');
                        }
                        alert("Tạo bài báo thành công!\n");

                    });
                } else {
                    return response.json().then(error => {
                        alert("Tạo bài báo thất bại. \n" + error.message);
                    });
                }
            }
        )
        .catch(error => {
            alert("Tạo bài báo thất bại. \n" + error.message);
        });
}


