async function getReportStatistic(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    const url = `${BACKEND_URL}/api/getReportStatistic`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu report.');
        }

        const responseJSON = await response.json();

        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy report.');
        }

        const report = responseJSON.Reports;
        const sortedReport = report.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const latestReportsMap = new Map();
        sortedReport.forEach(report => {
            if (!latestReportsMap.has(report.orgId)) {
                const remaining = parseFloat(report.remaining) || 0;
                const budget = parseFloat(report.budget) || 1;
                const percented = (remaining / budget) * 100;

                latestReportsMap.set(report.orgId, {
                    orgId: report.orgId,
                    percented: parseFloat(percented.toFixed(2))
                });
            }
        });
        let reportStatitic=[];
        reportStatitic = Array.from(latestReportsMap.values());
        return reportStatitic;

    } catch (error) {
        console.error('Lỗi khi lấy feedbackStatistic:', error);
        throw new Error(error.message);
    }
}


function getReport(search_keyword,page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getReports?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy các báo cáo.');
                    }
                    const data=responseJSON.Reports;
                    populateReportTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getReport('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getReport('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getReport('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy các báo cáo. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy các báo cáo.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy các báo cáo.\n" + error.message);
    })
}

function populateReportTable(data) {

    const tableBody = document.getElementById('search-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach((report, index) => {

        const updatedDateFormatted = new Date(report.updatedAt).toLocaleString('vi-VN', {
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
      <td>${report.orgId}</td>
      <td>${report.cccdAmin}</td>
      <td>${report.remaining}</td>
      <td>${report.budget}</td>
      <td>${report.damages}</td>
      <td>${report.comment}</td>
      <td>${updatedDateFormatted}</td>
    `;
        tableBody.appendChild(row);
    });
}