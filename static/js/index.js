var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.find_by_id = function(id) {
        return function(elem) {
            return elem.id == id;
        };
    };
    self.is_auth_user_enrollment = function(elem) {
        return elem.user_id == self.vue.auth_user.id;
    };
    self.get_auth_user = function() {
        return $.getJSON(get_auth_user_url).fail(function() {
            alert('ERROR - getJSON request (get_auth_user_url) failed');
        });
    };
    self.get_users = function() {
        return $.getJSON(get_users_url).fail(function() {
            alert('ERROR - getJSON request (get_users_url) failed');
        });
    };
    self.get_enrollments = function() {
        return $.getJSON(get_enrollments_url).fail(function() {
            alert('ERROR - getJSON request (get_enrollments_url) failed');
        });
    };
    self.get_courses = function() {
        return $.getJSON(get_courses_url).fail(function() {
            alert('ERROR - getJSON request (get_courses_url) failed');
        });
    };
    self.init_auth_user_enrollments = function() {
        let auth_user_enrollments = self.vue.enrollments.filter(self.is_auth_user_enrollment);
        self.vue.auth_user_enrollments = auth_user_enrollments;
    };
    self.init_data = function() {
        $.when(self.get_auth_user(), self.get_users(), self.get_enrollments(), self.get_courses()).done(function(response1, response2, response3, response4) {
            self.vue.auth_user = response1[0].auth_user;
            self.vue.users = response2[0].users;
            self.vue.enrollments = response3[0].enrollments;
            self.vue.courses = response4[0].courses;
            self.init_auth_user_enrollments();
        }).fail(function() {
            alert('ERROR - one or more getJSON requests fail');
        });
    };
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            auth_user: null,
            users: [],
            enrollments: [],
            courses: [],
            auth_user_enrollments: [],
        },
        methods: {
        },
        computed: {
        },
        created() {
            self.init_data();
            $('#vue-div').show();
        },
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
