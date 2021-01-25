// Support for LocalStorage when running on Express server
var LocalStorage = require('node-localstorage').LocalStorage;
storage = new LocalStorage('./scratch');

// Store DOM elements into variables
var statusText = document.getElementById("statusText");
var username = document.getElementById("username");
var password = document.getElementById("password");
var repeatpassword = document.getElementById("repeatpassword");
var email = document.getElementById("email");
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
function TryToRegister()
{

    // We check if all fields have been filled with 3 or more chars
    if(email.value.length == 0) { statusText.textContent = "You must specify an email"; return; }
    if(username.value.length == 0) { statusText.textContent = "You must specify an username"; return; }
    if(password.value.length == 0) { statusText.textContent = "You must specify a password"; return; }
    if(email.value.length < 4) { statusText.textContent = "Email field must contain more than 3 characters"; return; }
    if(username.value.length < 4) { statusText.textContent = "Username field must contain more than 3 characters"; return; }
    if(password.value.length < 4) { statusText.textContent = "Password field must contain more than 3 characters"; return; }
    if(username.value.length > 40) { statusText.textContent = "Username field must contain less than 41 characters"; return; }
    if(username.value.length > 15) { statusText.textContent = "Username field must contain less than 16 characters"; return; }
    if(password.value.length > 50) { statusText.textContent = "Password field must contain less than 51 characters"; return; }

    if(grecaptcha.getResponse() == "" || grecaptcha.getResponse() == "undefined" || grecaptcha.getResponse() == null)
    {
        statusText.textContent = "Please, fill the captcha to verify that you are not a robot";
        return;
    }

    if(password.value != repeatpassword.value)
    {
        statusText.textContent = "Specified passwords do not match";
        return;
    }

    // We limit all bad entry types and see if email is correctly formated
    if(!validateEmail(email.value))
    {
        statusText.textContent = "The specified email is badly formatted";
        return;
    }

    statusText.textContent = "We are trying to register your user...";

    // Anti register button spam (client-sided) (move to php-sessions serverside if some stupid tries to flood)
    if(noSpam == 1)
    {
        statusText.textContent = "Please don't flood the register button, bandwidth is not free.";
        return;
    }

    const Url = 'https://cyberdevelopment.es/BotSentry/panel/registerUser.php';
    var http = new XMLHttpRequest();
    var params = 'username=' + username.value + '&pass=' + password.value + '&token=' + grecaptcha.getResponse() + '&email=' + email.value;
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

    if(response == "no_recaptcha")
    {
        statusText.textContent = "Please, fill the captcha to verify that you are not a robot";
    }
    else if(response == "captcha_success")
    {
        
    }
    else if(response == "captcha_fail")
    {
        statusText.textContent = "You will need to re-do the captcha again.";
        grecaptcha.reset();
    }
    else if(response == "invalid_email")
    {
        statusText.textContent = "The specified e-mail is not in a valid format";
    }
    else if(response == "captcha_successalready_registered")
    {
        statusText.textContent = "This username or email have been already registered";
    }
    else if(response == "emails_limit")
    {
        status.textContent = "You reached the amount of emails sent, come back later";
    }
    else if(response == "server_error")
    {
        status.textContent = "Our servers are having issues, come back later";
    }
    else if(response == "missing_parameters")
    {
        status.textContent = "You must fill all the fields";
    }
    // Need more control, as then we will have to save its e-mail to the localStorage and pass to the next HTML to verify the email
    else if(response == "captcha_successsent_email_")
    {
        storage.setItem('email', email.value);
        storage.setItem('username', username.value);
        storage.setItem('password', password.value);
        window.location.href = "../account_verify/index.html";
    }
}

// Method that will be executed when the login web-request is not correctly processed
function ProcessBadLoginResponse()
{
    statusText.textContent = "Our servers are currently experiencing issues.";
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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