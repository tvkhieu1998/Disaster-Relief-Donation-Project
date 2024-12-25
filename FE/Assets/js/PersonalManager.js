function applyPersonalProfile() {
    let nameInfor = document.getElementById("nameInfor");
    let cccdInfor = document.getElementById("cccdInfor");
    let ageInfor = document.getElementById("ageInfor");
    let roleInfor = document.getElementById("roleInfor");
    let phoneInfor = document.getElementById("phoneInfor");
    let emailInfor = document.getElementById("emailInfor");
    let addressInfor = document.getElementById("addressInfor");

    if (
        !nameInfor || !cccdInfor || !ageInfor || !roleInfor || !phoneInfor || !emailInfor || !addressInfor
    ) {
        return;
    }

    nameInfor.textContent = sessionStorage.getItem("name");
    cccdInfor.textContent = sessionStorage.getItem("CCCD");
    ageInfor.textContent = sessionStorage.getItem("age");
    roleInfor.textContent = sessionStorage.getItem("roleId");
    phoneInfor.textContent = sessionStorage.getItem("phoneNumber");
    emailInfor.textContent = sessionStorage.getItem("email");
    addressInfor.textContent = sessionStorage.getItem("address");

    const roleCode = sessionStorage.getItem('roleCode');
    if(roleCode==="1")
    {
        let deleteAccountButton = document.getElementById("deleteAccountButton");
        deleteAccountButton.disabled = true;

        let donationField = document.getElementById("donation-field");
        donationField.classList.add("d-none");

        let nonorgCharityField = document.getElementById("non-orgCharity-field");
        nonorgCharityField.classList.add("d-none");

        let orgCharityField = document.getElementById("orgCharity-field");
        orgCharityField.classList.add("d-none");
    }

    if(roleCode==="3")
    {
        let donationField = document.getElementById("donation-field");
        donationField.classList.add("d-none");
    }

    if(roleCode==="4")
    {
        let donationField = document.getElementById("donation-field");
        donationField.classList.add("d-none");

        let nonorgCharityField = document.getElementById("non-orgCharity-field");
        nonorgCharityField.classList.add("d-none");

        let orgCharityField = document.getElementById("orgCharity-field");
        orgCharityField.classList.add("d-none");
    }

}
applyPersonalProfile();

function applyDonationProfile(amount,count){
    let donateTotalInfor = document.getElementById("donateTotalInfor");
    let donateTimesInfor = document.getElementById("donateTimesInfor");
    if (
        !donateTotalInfor || !donateTimesInfor
    ) {
        return;
    }
    donateTotalInfor.textContent=amount;
    donateTimesInfor.textContent=count;

}

async function applyOrgProfile(){
    const userCCCD = sessionStorage.getItem("CCCD");
    if (!userCCCD) {return;}
    let orgNameInfor = document.getElementById("orgNameInfor");
    let orgContractInfor = document.getElementById("orgContractInfor");
    let orgVerifyInfor = document.getElementById("orgVerifyInfor");
    if (
        !orgNameInfor || !orgContractInfor
    ) {
        return;
    }
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCharityOrgByKey?search_keyword=${encodeURIComponent(userCCCD)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                    }
                    let data=responseJSON.orgData;
                    let buttonRequestOpenOrg = document.getElementById("button-request-open-org");
                    let buttonManageOrg = document.getElementById("button-manage-org");
                    if (!data) {
                        orgNameInfor.textContent='Không';
                        orgContractInfor.textContent='Không';
                        orgVerifyInfor.textContent = "Không";
                        if (buttonRequestOpenOrg) {
                            buttonRequestOpenOrg.classList.remove("disabled");
                        }
                        if (buttonManageOrg) {
                            buttonManageOrg.classList.add("disabled");
                        }
                    }
                    else{
                        orgNameInfor.textContent=data.orgname;
                        orgContractInfor.textContent=data.contractInfo;
                        let isVerify = data.isVerify;
                        if (isVerify) {
                            orgVerifyInfor.textContent = "Được chấp thuận";
                            orgVerifyInfor.style.color = "green";
                            if (buttonRequestOpenOrg) {
                                buttonRequestOpenOrg.classList.add("disabled");
                            }
                            if (buttonManageOrg) {
                                buttonManageOrg.classList.remove("disabled");
                            }
                        } else {
                            orgVerifyInfor.textContent = "Chưa được chấp thuận";
                            orgVerifyInfor.style.color = "red";
                            if (buttonRequestOpenOrg) {
                                buttonRequestOpenOrg.classList.add("disabled");
                            }
                            if (buttonManageOrg) {
                                buttonManageOrg.classList.add("disabled");
                            }
                        }
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin tổ chức. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin tổ chức.\n" + error.message);
    });
}

async function applyCampaignProfile(){
    const orgId = sessionStorage.getItem("orgId");
    if (!orgId) {return;}
    let campaignId = document.getElementById("campaignId");
    let campaignDes = document.getElementById("campaignDes");
    let campaignStatus = document.getElementById("campaignStatus");
    let campaignRemaining = document.getElementById("campaignRemaining");
    let campaignBudget = document.getElementById("campaignBudget");
    let campaignDisasterId = document.getElementById("campaignDisasterId");
    let campaignDamages = document.getElementById("campaignDamages");
    let campaignStartDate = document.getElementById("campaignStartDate");
    let campaignEndDate = document.getElementById("campaignEndDate");
    if (!campaignId || !campaignDes || !campaignStatus || !campaignRemaining ||
        !campaignBudget || !campaignDisasterId || !campaignDamages ||
        !campaignStartDate || !campaignEndDate) {
        return;
    }
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCampaignByKey?search_keyword=${encodeURIComponent(orgId)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                    }
                    let orgCharityField = document.getElementById("orgCharity-field");
                    const roleCode = sessionStorage.getItem('roleCode');
                    if(roleCode!=="3")
                    {
                        orgCharityField.classList.add("d-none");
                        return;
                    }
                    orgCharityField.classList.remove("d-none");
                    let buttonRequestOpenCampaign = document.getElementById("button-request-open-campaign");
                    let buttonManageCampaign = document.getElementById("button-manage-campaign");
                    if (!responseJSON.campaigns || responseJSON.campaigns.length === 0) {
                        if (buttonRequestOpenCampaign) {
                            buttonRequestOpenCampaign.classList.remove("disabled");
                        }
                        if (buttonManageCampaign) {
                            buttonManageCampaign.classList.add("disabled");
                        }
                        return;
                    }
                    if (buttonRequestOpenCampaign) {
                        buttonRequestOpenCampaign.classList.add("disabled");
                    }
                    if (buttonManageCampaign) {
                        buttonManageCampaign.classList.remove("disabled");
                    }
                    let data=responseJSON.campaigns[0];
                    const startDateFormatted = new Date(data.startDate).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    const endDateFormatted = new Date(data.endDate).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    campaignId.textContent=data.campaignId;
                    campaignDes.textContent=data.description;
                    campaignRemaining.textContent=data.remaining;
                    campaignBudget.textContent=data.budget;
                    campaignDisasterId.textContent=data.disasterId;
                    campaignDamages.textContent=data.damages;
                    campaignStartDate.textContent=startDateFormatted;
                    campaignEndDate.textContent=endDateFormatted;
                    let status = data.status;
                    if (status==="Stop") {
                        campaignStatus.textContent = "Đã dừng";
                        campaignStatus.style.color = "red";
                    } else {
                        campaignStatus.textContent = "Đang hoạt động";
                        campaignStatus.style.color = "green";
                    }

                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin tổ chức. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin tổ chức.\n" + error.message);
    });
}






function syncPersonalProfile()
{
    let nameInfor = document.getElementById("name");
    let cccdInfor = document.getElementById("cccd");
    let ageInfor = document.getElementById("age");
    let addressInfor = document.getElementById("address");

    if (
        !nameInfor || !cccdInfor || !ageInfor || !addressInfor
    ) {
        return;
    }
    nameInfor.value = sessionStorage.getItem("name");
    cccdInfor.value = sessionStorage.getItem("CCCD");
    ageInfor.value = sessionStorage.getItem("age");
    addressInfor.value = sessionStorage.getItem("address");
}

function updateAccount()
{
    const updatedData={
        cccd:document.getElementById("cccd").value,
        name:document.getElementById("name").value,
        email:sessionStorage.getItem("email"),
        password: document.getElementById("password").value,
        age:document.getElementById("age").value,
        address: document.getElementById("address").value,
    }
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const Authorization=sessionStorage.getItem('Access_Token');

    fetch(`${BACKEND_URL}/api/update-account`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Authorization}`,
        },
        body: JSON.stringify(updatedData)
    }).then(response  => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.');
                }
                const userData = responseJSON.UserData;
                sessionStorage.setItem('CCCD', userData.cccd);
                sessionStorage.setItem('name', userData.name);
                sessionStorage.setItem('age', userData.age);
                sessionStorage.setItem('address', userData.address);

                alert("Cập nhật thông tin thành công!");
                window.location.href ="/Pages/personal.html";
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi cập nhật thông tin. \n" + errorData.message);
                window.location.href ="/Pages/personal.html";
            });
        }
    })
        .catch(error => {
            alert("Cập nhật thông tin thất bại. \n" + error.message);
            window.location.href ="/Pages/personal.html";
        });

}

function deleteAccount() {
    const userCCCD = sessionStorage.getItem("CCCD");
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
            cccd: userCCCD,
            confirmation: true
        }),
    }).then(response => {
        if (response.ok) {
            return response.json().then(responseJSON => {
                if(responseJSON.error===1)
                {
                    throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi xóa người dùng.');
                }
                sessionStorage.clear();
                alert("Xóa tài khoản thành công" + responseJSON.message);
                window.location.href = "/index.html";
            })
        }else {
            return response.json().then(errorData => {
                alert("Đã xảy ra lỗi khi xóa. \n" + errorData.message);
                window.location.href ="/Pages/personal.html";
            });
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xóa.\n" + error.message);
        window.location.href ="/Pages/personal.html";
    });
}

function getDonations(search_keyword='',page){
    if(page===0) return;
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/donations?search_keyword=${encodeURIComponent(search_keyword)}&pageIndex=${encodeURIComponent(page)}`;
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
                        throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin đóng góp.');
                    }
                    const data=responseJSON.donationList;
                    populateDonationTable(data);

                    const prevPage=page-1;
                    const nextPage=page+1;

                    const paging = document.getElementById('paging');
                    const disableNext = !data || data.length === 0;
                    if(disableNext){
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getDonations('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <span class="disabled"> Tiếp >>></span>`;
                    }else{
                        paging.innerHTML = `<a href="javascript:void(0)" onclick="getDonations('${search_keyword}',${prevPage})"> <<< Trở lại</a>
                                        <a href="javascript:void(0)" onclick="getDonations('${search_keyword}',${nextPage})"> Tiếp >>></a>`;
                    }
                })
            }else {
                return response.json().then(errorData => {
                    alert("Đã xảy ra lỗi khi lấy thông tin đóng góp. \n" + errorData.message);
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin đóng góp.');
                });
            }
        }).catch(error => {
        console.error("Error fetching account:", error.message);
        alert("Đã xảy ra lỗi khi lấy thông tin đóng góp.\n" + error.message);
    });
}

function populateDonationTable(data) {

    const tableBody = document.getElementById('donations-result');
    if(!data || data.length === 0) return tableBody.innerHTML = '<span class="text-center">--- Hết danh sách ---</span></h3>';
    tableBody.innerHTML = '';
    data.forEach(donation => {
        const updatedAtFormatted = new Date(donation.updatedAt).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${donation.id}</td>
      <td>${donation.orgId}</td>
      <td>${donation.amount}</td>
      <td>${donation.paymentMethod}</td>
      <td>${donation.status}</td>
      <td>${updatedAtFormatted}</td>
    `;
        tableBody.appendChild(row);
    });

}