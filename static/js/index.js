var app = function() {
    var self = {};
    Vue.config.silent = false;

    // Private Helper functions
    self.init_data = function() {
        $.when(
            get_auth_user(get_auth_user_url), 
            get_users(get_users_url), 
            get_enrollments(get_enrollments_url), 
            get_courses(get_courses_url)
        ).done(function(response1, response2, response3, response4) { // note: if more than one param, use response[0].users else response.users
            self.vue.auth_user = response1[0].auth_user;
            self.vue.users = response2[0].users;
            self.vue.enrollments = response3[0].enrollments;
            self.vue.courses = response4[0].courses;
            self.vue.is_loaded = true;
        });
    };

    // List rendering functions
    self.auth_user_current_enrollments = function() {
        // query auth_user's enrollments
        var enrollments = self.vue.enrollments.filter(is_user_id(self.vue.auth_user.id));
        // query this quarter's enrollments
        enrollments = enrollments.filter(is_quarter(self.vue.current_quarter));
        for(var i=0; i<enrollments.length; i++) {
            let course = self.vue.courses.find(is_name(enrollments[i].course_name));
            enrollments[i].course_description = course.description;
        };
        return enrollments;
    };
    self.users_enrolled = function(enrollments) {
        let users = [];
        for(var i=0; i<enrollments.length; i++) {
            let user_id = enrollments[i].user_id;
            let user = self.vue.users.find(is_id(user_id));
            if(user) {
                let users_i = users.push({id:user_id, name:user.first_name+' '+user.last_name, quarter:enrollments[i].quarter}) - 1;
                if(enrollments[i].is_grade_public) {
                    users[users_i].grade = enrollments[i].grade;
                };
            };
        };
        return users;
    };

    self.users_currently_enrolled = function(course_name) {
        // query specific course's enrollments
        // console.log(course_name);
        // self.vue.search_toggle = false;

        var enrollments = self.vue.enrollments.filter(is_course_name(course_name));
        // console.log(enrollments);
        // query all but auth_user's enrollments
        enrollments = enrollments.filter(is_not_user_id(self.vue.auth_user.id));
        // query this quarter's enrollments
        enrollments = enrollments.filter(is_quarter(self.vue.current_quarter));
        let users = self.users_enrolled(enrollments);
        return users;
    };
    self.users_past_enrolled = function(course_name) {
        // query specific course's enrollments
        var enrollments = self.vue.enrollments.filter(is_course_name(course_name));
        // query all but auth_user's enrollments
        enrollments = enrollments.filter(is_not_user_id(self.vue.auth_user.id));
        // query all but this quarter's enrollments
        enrollments = enrollments.filter(is_not_quarter(self.vue.current_quarter));
        let users = self.users_enrolled(enrollments);
        return users;
    };

    
    // Other functions
    self.is_transcript_loaded = function() {
        return (self.vue.enrollments.find(is_user_id(self.vue.auth_user.id)) != null);
    };


    // UI functions
    self.click_course = function(id) {
        console.log(id);
        let clicked_course_i = self.vue.clicked_courses.findIndex(is_elem(id));
        if(clicked_course_i == -1) {
            self.vue.clicked_courses.push(id);
        } else {
            self.vue.clicked_courses.splice(clicked_course_i, 1);
        };
    };
    self.click_user = function(id) {
        window.location.href = profile_url+'/'+id;
    };
    self.click_info = function(id) {
        console.log(id);
        let clicked_info_i = self.vue.clicked_info.findIndex(is_elem(id));
        if(clicked_info_i == -1) {
            self.vue.clicked_info.push(id);
        } else {
            self.vue.clicked_info.splice(clicked_info_i, 1);
        }
    };

    function get_term(term_string) {
        let year = term_string.substr(0, 1) + term_string.substr(2, 2);
        let qtr_string = term_string.split(' ')[1];
        let qtr = null;
        if(qtr_string === 'Fall') {
            qtr = '8';
        } else if (qtr_string === 'Summer') {
            qtr = '4';
        } else if (qtr_string === 'Spring') {
            qtr = '2';
        } else if (qtr_string === 'Winter') {
            qtr = '0';
        } else {
            console.log('get_term() invalid quarter')
            return null;
        }
        //console.log('term string: ' + year + qtr);
        return year + qtr;
    }

    function split_course_name(course_id) {
        let split = self.vue.courses.find(x => x.id === course_id).name.split(' ');
        //console.log('split: ' + split[0] + ' ' + split[1]);
        return split;

    }


    self.search = function()
    {
        if(!self.vue.search_toggle)
        {
            self.vue.search_toggle = !self.vue.search_toggle;
        }
        // self.vue.search_toggle = !self.vue.search_toggle;
        self.vue.search_temp = self.vue.search_term;
        var enrollments = self.vue.enrollments.filter(is_course_name(self.vue.search_temp));
        if(enrollments.length==0)
        {
            self.vue.search_exists = false;
        } else
        {
            self.vue.search_exists = true;
        }
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
            info: [{}],
            clicked_info: [],
            current_quarter: '2018 Spring Quarter',
            search_term: null,
            search_toggle: false,
            search_temp: null,
            search_exists: false
        },
        methods: {
            is_elem: is_elem,
            auth_user_current_enrollments: self.auth_user_current_enrollments,
            users_currently_enrolled: self.users_currently_enrolled,
            users_past_enrolled: self.users_past_enrolled,

            is_transcript_loaded: self.is_transcript_loaded,
            search: self.search,
            click_course: self.click_course,
            click_user: self.click_user,
            click_info: self.click_info,
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
