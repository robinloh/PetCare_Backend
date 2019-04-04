function check(event) {
    // Get Values
    var email       = document.getElementById('email'   ).value;
    var name        = document.getElementById('name'    ).value;
    var phone       = document.getElementById('phone'    ).value;
    var age         = document.getElementById('age'    ).value;
    var password    = document.getElementById('password').value;


    if (email.length == 0) {
        alert("Invalid email address");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (name.length == 0) {
        alert("Invalid name");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (phone.length < 8) {
        alert("Invalid phone number");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (age.length == 0) {
        alert("Invalid age");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (password.length < 6) {
        alert("Invalid password");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}