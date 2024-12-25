function showPassword(){
    const checkboxPasswords = document.querySelectorAll('.checkboxPassword');
    const passwordFields = document.querySelectorAll('.passwordField');
    if (!checkboxPasswords.length || !passwordFields.length) return;
    checkboxPasswords.forEach(
        (checkbox, index)=> {
            checkbox.addEventListener("change", () => {
                const passwordField = passwordFields[index];
                if (checkbox.checked) {
                    passwordField.type = "text";
                } else {
                    passwordField.type = "password";
                }
            }
        )
    });
}
showPassword();


function checkValidCCCD()
{
    const cccdInput = document.getElementById("cccd");
    const cccdError = document.getElementById("cccd-error");
    const cccdRegex = /[0-9]{12}$/;
    if (!cccdInput||!cccdError) return;
    cccdInput.addEventListener("blur",() => {
            if(cccdRegex.test(cccdInput.value))
            {
                cccdError.textContent  = null;
            }
            else
            {
                if(cccdInput.value.trim() === ""){cccdError.textContent  = "Mã căn cước công dân không được bỏ trống.";}
                else{cccdError.textContent  = "Mã căn cước công dân không hợp lệ.";}
            }

    });
}

function checkValidName()
{
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("name-error");
    if (!nameInput||!nameError) return;
    nameInput.addEventListener("blur",() => {
        if(nameInput.value.trim() === ""){nameError.textContent  = "Họ và tên không được bỏ trống.";}
        else{nameError.textContent  = null;}
    });
}

function checkValidEmail()
{
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailInput||!emailError) return;
    emailInput.addEventListener("blur",() => {
        if(emailRegex.test(emailInput.value))
        {
            emailError.textContent  = null;
        }
        else
        {
            if(emailInput.value.trim() === ""){emailError.textContent  = "Địa chỉ email không được bỏ trống.";}
            else{emailError.textContent  = "Địa chỉ email không hợp lệ. Sai định dạng email.";}
        }
    });
}

function checkValidPassword() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordInput||!passwordError) return;
    passwordInput.addEventListener("input",() => {
        if(passwordRegex.test(passwordInput.value))
        {
            passwordError.textContent  = null;
        }
        else
        {
            if(passwordInput.value.trim() === ""){passwordError.textContent  = "Mật khẩu không được bỏ trống.";}
            else{passwordError.textContent  = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.";}
        }

    });
}

function checkConfirmPassword(){
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const confirmPasswordError = document.getElementById("confirmPassword-error");
    if (!passwordInput||!confirmPasswordInput||!confirmPasswordError) return;
    const validateConfirmPasswords = () => {
        if (confirmPasswordInput.value === passwordInput.value) {
            confirmPasswordError.textContent = "";
        } else {
            if (confirmPasswordInput.value.trim() === "") {
                confirmPasswordError.textContent = "Xác nhận mật khẩu không được bỏ trống.";
            } else {
                confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp với mật khẩu bên trên.";
            }
        }
    };
    passwordInput.addEventListener("input", validateConfirmPasswords);
    confirmPasswordInput.addEventListener("input", validateConfirmPasswords);

}





function checkValidPhonenumber()
{
    const phoneNumberInput = document.getElementById("phoneNumber");
    const phoneNumberError = document.getElementById("phoneNumber-error");
    const buttonPhoneNumber = document.querySelectorAll(".buttonPhoneNumber");
    const phoneNumberRegex = /^\+84[1-9][0-9]{8}$/;

    if (!phoneNumberInput||!phoneNumberError||!buttonPhoneNumber.length) return;

    phoneNumberInput.addEventListener("blur",() => {
        if(phoneNumberRegex.test(phoneNumberInput.value))
        {
            console.log(buttonPhoneNumber);
            phoneNumberError.textContent  = null;
            buttonPhoneNumber.forEach(button=> {
                button.disabled = false;
            });
        }
        else
        {
            if(phoneNumberInput.value.trim() === ""){phoneNumberError.textContent  = "Số điện thoại không được bỏ trống.";}
            else{
                phoneNumberError.textContent  = "Số điện thoại không hợp lệ.";
                buttonPhoneNumber.forEach(button=> {
                    button.disabled = true;
                });
            }

        }
    });
}

function checkValidAge()
{
    const ageInput = document.getElementById("age");
    const ageError = document.getElementById("age-error");
    if (!ageInput||!ageError) return;
    ageInput.addEventListener("blur",() => {
        const age = parseInt(ageInput.value, 10);
        if(age>=18)
        {
            ageError.textContent  = null;
        }
        else
        {
            if(ageInput.value.trim() === ""){ageError.textContent  = "Tuổi không được bỏ trống.";}
            else{
                ageError.textContent  = "Tuổi phải lớn 18 mới được phép tham gia đóng góp.";
            }
        }
    });
}
function checkValidAddress()
{
    const addressInput = document.getElementById("address");
    const addressError = document.getElementById("address-error");
    if (!addressInput||!addressError) return;
    addressInput.addEventListener("blur",() => {
        if(addressInput.value.trim() === ""){addressError.textContent  = "Địa chỉ không được bỏ trống.";}
        else{addressError.textContent  = null;}
    });
}
function activeRegisterButton()
{
    const finalButton = document.getElementById("finalButton");
    const errorFields = document.querySelectorAll(".errorField");

    if (!finalButton||!errorFields.length) return;
    finalButton.disabled=false;
    errorFields.forEach(field => {
        console.log(field);
        if(field.textContent.trim() !== "")
        {
            finalButton.disabled=true;
        }
    });
    // document.querySelectorAll("input").forEach(inputField => {
    //     console.log(inputField.textContent);
    //     inputField.addEventListener("blur", activeRegisterButton);
    // });
    document.addEventListener("DOMContentLoaded", () => {
        const inputFields = document.querySelectorAll("input");
        inputFields.forEach(inputField => {
            inputField.addEventListener("blur", activeRegisterButton);
        });
    });


}
//Check all input fields:
checkValidCCCD()
checkValidName()
checkValidEmail()
checkValidPassword()
checkConfirmPassword()
checkValidPhonenumber()
checkValidAge()
checkValidAddress()
activeRegisterButton()










function gotoPage(path) {
    window.location.href = path;
}
function register(){
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL= 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';

    let cccd=document.getElementById("cccd").value;
    let name=document.getElementById("name").value;
    let email= document.getElementById("email").value;
    let password= document.getElementById("password").value;
    let phoneNumber= document.getElementById("phoneNumber").value.replace("+84", "0");
    let age=document.getElementById("age").value;
    let address= document.getElementById("address").value;

    const radios = document.getElementsByName('roleOptions');
    let roleId = null;
    radios.forEach(radio => {
        if (radio.checked) {
            roleId = radio.value;
        }
    });

    const registerData={
        cccd:cccd,
        name:name,
        email: email,
        roleId:roleId,
        password: password,
        phoneNumber: phoneNumber,
        age:age,
        address: address,
    }
    fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Đã xảy ra lỗi khi đăng ký.');
                });
            }
        }).then(responseJSON => {
            const response =responseJSON.response;
            console.log('responseJSON: ',response);
            console.log('responseJSON error: ',response.error);
        if (response.error === 1) {
            alert("Đăng ký thất bại.");
            gotoPage("/Pages/registerFalse.html");
            throw new Error(response.message || 'Đã xảy ra lỗi khi xử lý.');
        }
        alert("Đăng ký thành công!");
        gotoPage("/Pages/registerSuccess.html");
    }).catch(error => {
            alert("Đăng ký thất bại. \n" + error.message);
            gotoPage("/Pages/registerFalse.html");
        });
}

async function login() {
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL = 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đã xảy ra lỗi khi đăng nhập.');
        }

        const responseJSON = await response.json();
        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi đăng nhập.');
        }

        sessionStorage.setItem('Access_Token', responseJSON.Access_Token);
        sessionStorage.setItem('email', responseJSON.email);
        sessionStorage.setItem('roleCode', responseJSON.roleId);

        switch (responseJSON.roleId) {
            case 1:
                sessionStorage.setItem('roleId', "Quản trị viên"); break;
            case 2:
                sessionStorage.setItem('roleId', "Người dùng"); break;
            case 3:
                sessionStorage.setItem('roleId', "Tổ chức từ thiện"); break;
            case 4:
                sessionStorage.setItem('roleId', "Người nhận hỗ trợ"); break;
        }


        await getAccount(responseJSON.email);

        alert("Đăng nhập thành công!");
        gotoPage("/Pages/loginSuccess.html");
    } catch (error) {
        alert("Đăng nhập thất bại. \n" + error.message);
        gotoPage("/Pages/loginFalse.html");
    }
}


async function getAccount(search_keyword) {
    //const BACKEND_URL= 'http://localhost:3000';
    const BACKEND_URL = 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/account?search_keyword=${encodeURIComponent(search_keyword)}`;
    const Authorization = sessionStorage.getItem('Access_Token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
        }

        const responseJSON = await response.json();
        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
        }

        const userData = responseJSON.UserData[0];
        sessionStorage.setItem('CCCD', userData.cccd);
        sessionStorage.setItem('name', userData.name);
        sessionStorage.setItem('phoneNumber', userData.phoneNumber);
        sessionStorage.setItem('age', userData.age);
        sessionStorage.setItem('address', userData.address);
        await checkOrgProfile(userData.cccd);
    } catch (error) {
        alert("Đã xảy ra lỗi khi lấy thông tin người dùng.\n" + error.message);
        throw error;
    }
}
async function checkOrgProfile(userCCCD) {
    const BACKEND_URL = 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getCharityOrgByKey?search_keyword=${encodeURIComponent(userCCCD)}`;
    const Authorization = sessionStorage.getItem('Access_Token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
        }

        const responseJSON = await response.json();
        if (responseJSON.error === 1) {
            throw new Error(responseJSON.message || 'Đã xảy ra lỗi khi lấy thông tin tổ chức.');
        }

        const data = responseJSON.orgData;

        if (data) {
            if(data.isVerify)
            {
                sessionStorage.setItem('roleCode', '3');
                sessionStorage.setItem('roleId', "Tổ chức từ thiện");
            }
            sessionStorage.setItem('orgId', data.orgId);
        }
    } catch (error) {
        alert("Đã xảy ra lỗi khi lấy thông tin tổ chức.\n" + error.message);
        throw error;
    }
}


