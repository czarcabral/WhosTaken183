var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.my_login = function() {
        let login_form = document.querySelector('#login_form').elements;
        let email = login_form['email'].value;
        let password = login_form['password'].value;
        $.post(my_login_url, 
            {email:email, password:password}, 
            function(data) {
                if(data.success) {
                    window.location.href = index_url;
                } else {
                    alert("Login failed - your email or password was incorrect");
                };
                $('#login_submit_btn').clickable = true;
            }
        ).fail(function() {
            alert("POST request - my_login() - failed");
        });
    }
    self.my_register = function() {
        let register_form = document.querySelector('#register_form').elements;
        let first_name = register_form['first_name'].value;
        let last_name = register_form['last_name'].value;
        let email = register_form['email'].value;
        let password1 = register_form['password1'].value;
        let password2 = register_form['password2'].value;
        if(password1==password2) {
            $.post(my_register_url, 
                {
                    first_name:first_name, 
                    last_name:last_name, 
                    email:email,
                    password:password1,
                },
                function(data) {
                    if(data.success) {
                        window.location.href = index_url;
                    } else {
                        alert("sign up failed"); 
                    };
                }
            ).fail(function() {
                alert("POST request - my_register() - failed");
            });
        } else {
            alert("passwords don't match");
        };
    }
    self.click_login = function() {
        self.vue.action = 'logging_in';
    }
    self.click_signup = function() {
        self.vue.action = 'signing_up';
    }
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            action: 'logging_in',
        },
        methods: {
            my_login: self.my_login,
            my_register: self.my_register,
            click_login: self.click_login,
            click_signup: self.click_signup,
            cancel_action: self.cancel_action,
        }
    });
    $('#vue-div').show();
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
