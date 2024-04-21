$(document).ready(function () {

    // Function to toggle side navigation 
    let loginForm = $("#loginForm");
    let signUpForm = $("#signupForm");  

    if (signUpForm.length) {
        signUpForm.validate({
            rules: {
                username: {
                    required: true,
                    minlength: 3
                },
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                username: {
                    required: "Please enter your username",
                    minlength: "Username must be at least 3 characters long"
                },
                password: {
                    required: "Please enter your password",
                    minlength: "Password must be at least 6 characters long"
                }
            },
            submitHandler: function (form) {
                form.submit(); // Submit the form
            }
        });
    }

    if(loginForm.length){
        loginForm.validate({
            rules: {
                username: {
                    required: true,
                    minlength: 3
                },
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                username: {
                    required: "Please enter your username",
                    minlength: "Username must be at least 3 characters long"
                },
                password: {
                    required: "Please enter your password",
                    minlength: "Password must be at least 6 characters long"
                }
            },
            submitHandler: function (form) {
                form.submit(); // Submit the form
            }
        });
    }

    // End of Events









});




