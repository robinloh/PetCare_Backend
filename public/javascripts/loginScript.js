function check(event) {
    // Get Values
    var email    = document.getElementById('email'   ).value;
    var password = document.getElementById('password').value;

    // Simple Check
    if (email.length == 0) {
        alert("Invalid email address");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (password.length < 3) {
        alert("Invalid password");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}