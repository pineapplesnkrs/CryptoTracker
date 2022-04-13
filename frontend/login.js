let page = '<html>'+
'<head><title>Login Page</title></head>'+

'<body>'+
'<h1>Login Page</h1>'+
'<form name="login">'+
'Username<input type="text" name="userid"/>'+
'Password<input type="text" name="password"/>'+
'<input type="button" onclick="check(this.form)" value="Login"/>'+
'<input type="reset" value="Cancel"/>'+
'<input type="button" value="Sign Up"/>'+
'</form>';

function check(form) {
    if (form.userid.value == "Link_me_to_the_DB" && form.password.value == "Link_to_DB") {
        window.open('all crypto listing page')
    }
    else {
        alert("Error Password or Username Invalid")
    }
}
'</body>'+
'</html>';

