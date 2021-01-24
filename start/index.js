// Method that will take the user to the login page
function MoveToLogin()
{
    localStorage.setItem('joined', 'true');
    window.location.href = "../login/index.html";
}

// Method that will check if the user joined the app before and take him to login
function CheckMoveToLogin()
{
    if(localStorage.getItem('joined'))
    {
        window.location.href = "../login/index.html";
    }
}