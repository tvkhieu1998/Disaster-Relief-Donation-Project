function signOut(){
    sessionStorage.clear();
    window.location.href = "/index.html";
}

function checkAccessToken() {
    const token = sessionStorage.getItem('Access_Token');
    const email = sessionStorage.getItem('email');
    const observer = new MutationObserver(() => {
        if (token) {
            const signedOutElements = document.querySelectorAll(".signedOut");
            signedOutElements.forEach(element => {
                element.hidden=true;
            });

            const signedInElements = document.querySelectorAll(".signedIn");
            signedInElements.forEach(element => {
               const username=document.getElementById("signedInName");
                username.textContent=email.split("@")[0];
                element.hidden=false;
            });

        }
        else
        {
            const signedOutElements = document.querySelectorAll(".signedOut");
            signedOutElements.forEach(element => {
                element.hidden=false;
            });
            const signedInElements = document.querySelectorAll(".signedIn");
            signedInElements.forEach(element => {
                element.hidden=true;
            });
        }

    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
checkAccessToken()

function checkShowFunction(){


    const roleCode = sessionStorage.getItem('roleCode');


    const observer = new MutationObserver(() => {
        const nonFuncs=document.querySelectorAll('.none-function');
        const userFuncs=document.querySelectorAll('.user-function');
        const orgFuncs=document.querySelectorAll('.org-function');
        const victimFuncs=document.querySelectorAll('.victim-function');
        const adminFuncs=document.querySelectorAll('.admin-function');
        if(!roleCode || roleCode === ''){
            // None:
            nonFuncs.forEach(element => element.classList.remove('d-none'));
            userFuncs.forEach(element => element.classList.add('d-none'));
            orgFuncs.forEach(element => element.classList.add('d-none'));
            victimFuncs.forEach(element => element.classList.add('d-none'));
            adminFuncs.forEach(element => element.classList.add('d-none'));
        }

        switch (roleCode) {
            case '1':
                // Admin:
                nonFuncs.forEach(element => element.classList.add('d-none'));
                userFuncs.forEach(element => element.classList.add('d-none'));
                orgFuncs.forEach(element => element.classList.add('d-none'));
                victimFuncs.forEach(element => element.classList.add('d-none'));
                adminFuncs.forEach(element => element.classList.remove('d-none'));
                break;

            case '2':
                // User:
                nonFuncs.forEach(element => element.classList.add('d-none'));
                userFuncs.forEach(element => element.classList.remove('d-none'));
                orgFuncs.forEach(element => element.classList.add('d-none'));
                victimFuncs.forEach(element => element.classList.add('d-none'));
                adminFuncs.forEach(element => element.classList.add('d-none'));
                break;

            case '3':
                // OrgCharity:
                nonFuncs.forEach(element => element.classList.add('d-none'));
                userFuncs.forEach(element => element.classList.add('d-none'));
                orgFuncs.forEach(element => element.classList.remove('d-none'));
                victimFuncs.forEach(element => element.classList.add('d-none'));
                adminFuncs.forEach(element => element.classList.add('d-none'));
                break;

            case '4':
                // Victim:
                nonFuncs.forEach(element => element.classList.add('d-none'));
                userFuncs.forEach(element => element.classList.add('d-none'));
                orgFuncs.forEach(element => element.classList.add('d-none'));
                victimFuncs.forEach(element => element.classList.remove('d-none'));
                adminFuncs.forEach(element => element.classList.add('d-none'));
                break;

            default:
                // Handle case where roleCode is not recognized
                console.log('Invalid role code');
                break;
        }

    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}
checkShowFunction()

async function getLatestReport() {
    const BACKEND_URL = 'https://da-disaster-relief-be-bc3bce628662.herokuapp.com';
    const url = `${BACKEND_URL}/api/getLatestReport`;
    const Authorization = sessionStorage.getItem('Access_Token');

    if(!Authorization){
    return;
}
    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const responseJSON = await response.json();
            if (responseJSON.error === 1) {
                return null;
            }
            return responseJSON.LatestTime;
        } else {
            const errorData = await response.json();
            console.error("Server Error:", errorData);
            return null;
        }
    } catch (error) {
        console.error("Error fetching:", error.message);
        return null;
    }
}


function showNotificationDot() {
    const notificationDot = document.getElementById('notification-dot');
    notificationDot.classList.add('active');
}

function hideNotificationDot() {
    const notificationDot = document.getElementById('notification-dot');
    notificationDot.classList.remove('active');
}

function repeatEvery30Seconds(callback) {
    const token = sessionStorage.getItem('Access_Token');
    if (token) {
        callback();
    }
    setInterval(callback, 30000);
}

async function checkNewReportTask() {
    console.log("Check report at: ", new Date().toLocaleTimeString());
    const latestReportFromClient = sessionStorage.getItem("latestReportFromClient");
    const latestReportFromServer = await getLatestReport();

    if (!latestReportFromClient || !latestReportFromServer) {
        return;
    }

    const clientTime = new Date(latestReportFromClient).getTime();
    const serverTime = new Date(latestReportFromServer).getTime();

    if (serverTime !== clientTime) {
        showNotificationDot();
        sessionStorage.setItem("latestReportFromClient", latestReportFromServer);
    }
}
repeatEvery30Seconds(checkNewReportTask);