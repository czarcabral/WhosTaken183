var app = function() {
    var self = {};
    Vue.config.silent = false;


    // API Calls
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


    // Private Helper functions
    self.init_data = function() {
        $.when(
            self.get_auth_user(), 
            self.get_users(), 
            self.get_enrollments(), 
            self.get_courses()
        ).done(function(response1, response2, response3, response4) { // <-- Note: if .when only has one function, then .done has the response.data
            self.vue.auth_user = response1[0].auth_user;
            self.vue.users = response2[0].users;
            self.vue.enrollments = response3[0].enrollments;
            self.vue.courses = response4[0].courses;
            self.vue.is_loaded = true;
        });
    };


    // List rendering functions
    self.users_enrolled = function(enrollments) {
        let users = [];
        for(var i=0; i<enrollments.length; i++) {
            let user_id = enrollments[i].user_id;
            let user = self.vue.users.find(self.is_id(user_id));
            let users_i = users.push({id:user_id, name:user.first_name+' '+user.last_name, quarter:enrollments[i].quarter}) - 1;
            // alert(users_i);
            if(enrollments[i].is_grade_public) {
                users[users_i].grade = enrollments[i].grade;
            };
        };
        return users;
    };
    self.users_currently_enrolled = function(course_name) {
        let this_ = self.vue;
        // query specific course's enrollments
        var enrollments = this_.enrollments.filter(self.is_course_name(course_name));
        // query all but auth_user's enrollments
        enrollments = enrollments.filter(self.is_not_user_id(this_.auth_user.id));
        // query this quarter's enrollments
        enrollments = enrollments.filter(self.is_quarter(this_.current_quarter));
        let users = self.users_enrolled(enrollments);
        return users;
    };
    self.users_past_enrolled = function(course_name) {
        let this_ = self.vue;
        // query specific course's enrollments
        var enrollments = this_.enrollments.filter(self.is_course_name(course_name));
        // query all but auth_user's enrollments
        enrollments = enrollments.filter(self.is_not_user_id(this_.auth_user.id));
        // query all but this quarter's enrollments
        enrollments = enrollments.filter(self.is_not_quarter(this_.current_quarter));
        let users = self.users_enrolled(enrollments);
        return users;
    };
    self.auth_user_current_enrollments = function() {
        let this_ = self.vue;
        // query auth_user's enrollments
        var enrollments = this_.enrollments.filter(self.is_user_id(this_.auth_user.id));
        // query this quarter's enrollments
        enrollments = enrollments.filter(self.is_quarter(this_.current_quarter));
        for(var i=0; i<enrollments.length; i++) {
            let course = this_.courses.find(self.is_name(enrollments[i].course_name));
            enrollments[i].course_description = course.description;
        };
        return enrollments;
    };


    // search and filter predicates
    self.is_elem = function(targ) {
        return function(elem) { return elem == targ; };
    };
    self.is_id = function(id) {
        return function(elem) { return elem.id == id; };
    };
    self.is_name = function(course_name) {
        return function(elem) { return elem.name == course_name; };
    };
    self.is_course_name = function(course_name) {
        return function(elem) { return elem.course_name == course_name; };
    };
    self.is_user_id = function(user_id) {
        return function(elem) { return elem.user_id == user_id; };
    };
    self.is_not_user_id = function(user_id) {
        return function(elem) { return elem.user_id != user_id; };
    };
    self.is_quarter = function(quarter) {
        return function(elem) { return elem.quarter == quarter; };
    };
    self.is_not_quarter = function(quarter) {
        return function(elem) { return elem.quarter != quarter; };
    };


    // UI functions
    self.click_course = function(id) {
        let clicked_course_i = self.vue.clicked_courses.findIndex(self.is_elem(id));
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
            is_loaded: false,
            auth_user: {},
            users: [{}],
            enrollments: [{}],
            courses: [{}],
            clicked_courses: [],
            current_quarter: '2018 Spring Quarter',
        },
        methods: {
            is_elem: self.is_elem,
            click_course: self.click_course,
            users_currently_enrolled: self.users_currently_enrolled,
            users_past_enrolled: self.users_past_enrolled,
            auth_user_current_enrollments: self.auth_user_current_enrollments,
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
