var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.find_ = function(id) {
        return function(elem) {
            return elem == id;
        };
    };
    self.find_by_name = function(course_name) {
        return function(elem) {
            return elem.name == course_name;
        };
    };
    self.is_auth_user_enrollment = function(elem) {
        return elem.user_id == self.vue.auth_user.id;
    };
    self.is_current_enrollment = function(elem) {
        return elem.quarter == self.vue.current_quarter;
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
    self.init_data = function() {
        $.when(
            self.get_auth_user(), 
            self.get_users(), 
            self.get_enrollments(), 
            self.get_courses()
        ).done(function(response1, response2, response3, response4) {
            self.vue.auth_user = response1[0].auth_user;
            self.vue.users = response2[0].users;
            self.vue.enrollments = response3[0].enrollments;
            self.vue.courses = response4[0].courses;
        });
    };
    self.click_course = function(id) {
        let clicked_course_i = self.vue.clicked_courses.findIndex(self.find_(id));
        if(clicked_course_i == -1) {
            self.vue.clicked_courses.push(id);
        } else {
            self.vue.clicked_courses.splice(clicked_course_i, 1);
        };
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
            clicked_courses: [],
            current_quarter: '2018 Spring Quarter',
        },
        methods: {
            find_: self.find_,
            click_course: self.click_course,
        },
        computed: {
            auth_user_current_enrollments: function() {
                let this_ = this;
                var enrollments = this_.enrollments.filter(self.is_auth_user_enrollment);
                enrollments = enrollments.filter(self.is_current_enrollment);
                for(var i=0; i<enrollments.length; i++) {
                    let course = this_.courses.find(self.find_by_name(enrollments[i].course_name));
                    enrollments[i].course_description = course.description;
                };
                return enrollments;
            },
            
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
