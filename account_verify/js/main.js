// Support for LocalStorage when running on Express server
var LocalStorage = require('node-localstorage').LocalStorage;
storage = new LocalStorage('./scratch');

// Store DOM elements into variables
var statusText = document.getElementById("statusText");
var token = document.getElementById("token");
var noSpam = 0;
setInterval(function(){ noSpam = 0; }, 1500);

// Panel JavaScript
function TryToVerify()
{
    statusText.textContent = "We are checking your credentials...";

    // Anti verify button spam (client-sided) (move to php-sessions serverside if some stupid tries to flood)
    if(noSpam == 1)
    {
        statusText.textContent = "Please don't flood the verify button, bandwidth is not free.";
        return;
    }

    // We check if both fields have been filled with 3 or more chars
    if(token.value.length == 0) { statusText.textContent = "You must specify a token"; return; }

    noSpam = 1;

    const Url = 'https://cyberdevelopment.es/BotSentry/panel/verifyToken.php';
    var http = new XMLHttpRequest();
    var params = 'email=' + storage.getItem('email') + '&token=' + token.value;
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
    if(response == "token_correct")
    {
        statusText.textContent = "Token is correct, redirecting to the login page.";
        window.location.href = "../login/index.html";
    }
    else if(response == "token_incorrect")
    {
        statusText.textContent = "The specified token is not correct.";
    }
    else if(response == "missing_parameters")
    {
        statusText.textContent = "You have to fill the form please.";
    }
    else if(response == "server_error")
    {
        statusText.textContent = "Our servers are currently experiencing issues.";
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