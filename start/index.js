// Support for LocalStorage when running on Express server
var LocalStorage = require('node-localstorage').LocalStorage;
storage = new LocalStorage('./scratch');

// Method that will take the user to the login page
function MoveToLogin()
{
    storage.setItem('joined', 'true');
    window.location.href = "../login/index.html";
}

// Method that will check if the user joined the app before and take him to login
function CheckMoveToLogin()
{
    if(storage.getItem('joined'))
    {
        window.location.href = "../login/index.html";
    }
}