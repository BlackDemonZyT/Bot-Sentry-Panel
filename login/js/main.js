// Support for LocalStorage when running on Express server
var LocalStorage = require('node-localstorage').LocalStorage;
storage = new LocalStorage('./scratch');

// Store DOM elements into variables
var statusText = document.getElementById("statusText");
var username = document.getElementById("username");
var password = document.getElementById("password");
var noSpam = 0;
setInterval(function(){ noSpam = 0; }, 1500);

// We check if the user already has an username and password in the localstorage, and we fill the gaps with them
if(storage.getItem('username').length > 0)
{
    username.value = storage.getItem('username');
}
if(storage.getItem('password').length > 0)
{
    password.value = storage.getItem('password');
}

// Panel JavaScript
function TryToLogin()
{
    statusText.textContent = "We are checking your credentials...";

    // Anti login button spam (client-sided) (move to php-sessions serverside if some stupid tries to flood)
    if(noSpam == 1)
    {
        statusText.textContent = "Please don't flood the login button, bandwidth is not free.";
        return;
    }

    // We check if both fields have been filled with 3 or more chars
    if(username.value.length == 0) { statusText.textContent = "You must specify an username"; return; }
    if(password.value.length == 0) { statusText.textContent = "You must specify a password"; return; }
    if(username.value.length < 4) { statusText.textContent = "Username field must contain more than 3 characters"; return; }
    if(password.value.length < 4) { statusText.textContent = "Password field must contain more than 3 characters"; return; }
    if(username.value.length > 15) { statusText.textContent = "Username field must contain less than 16 characters"; return; }
    if(password.value.length > 50) { statusText.textContent = "Password field must contain less than 51 characters"; return; }

    noSpam = 1;

    const Url = 'https://cyberdevelopment.es/BotSentry/panel/loginUser.php';
    var http = new XMLHttpRequest();
    var params = 'username=' + username.value + '&pass=' + password.value;
    http.open('POST', Url, true);
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            ProcessGoodLoginResponse(http.responseText);
        }
        else if(http.readyState == 4 && http.status != 200){
            ProcessBadLoginResponse();
        }
    }
    http.send(params);
}

// Method that will be executed when the login web-request is correctly processed
function ProcessGoodLoginResponse(response)
{
    if(response == "emails_limit")
    {
        statusText.textContent = "Our system already sent you a lot of emails, keep calm and return.";
    }
    else if(response == "incorrect_credentials")
    {
        statusText.textContent = "The specified password is incorrect.";
    }
    else if(response == "unknown_user_or_email")
    {
        statusText.textContent = "The specified user does not exist.";
    }
    else if(response == "unknown_server_error")
    {
        statusText.textContent = "Our servers are currently experiencing issues.";
    }
    else if(response == "correct")
    {
        status.textContent = "Introduced credentials are correct, redirecting to dashboard...";
        window.location.href = "../dashboard/html/index.html";
    }
    else if(response.includes("sent_email_"))
    {
        storage.setItem('email', response.replace("sent_email_", ""));
        window.location.href = "../account_verify/index.html";
    }
}

// Method that will be executed when the login web-request is not correctly processed
function ProcessBadLoginResponse()
{
    statusText.textContent = "Our servers are currently experiencing issues.";
}



// Template JavaScript
(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);