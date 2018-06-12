var app = function() {
    var self = {};
    Vue.config.silent = false;

    // Private Helper functions
    self.init_data = function() {
        $.when(
            get_auth_user(get_auth_user_url), 
            get_users(get_users_url), 
            get_enrollments(get_enrollments_url), 
            get_courses(get_courses_url),
            get_users2(users_url)
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
                let users_i = users.push({id:user_id, name:user.first_name+' '+user.last_name, quarter:enrollments[i].quarter, email: user.email}) - 1;
                if(enrollments[i].is_grade_public) {
                    users[users_i].grade = enrollments[i].grade;
                };
            };
        };
        return users;
    };

    self.users_currently_enrolled = function(course_name) {
        // query specific course's enrollments
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

    self.search = function()
    {
        console.log(self.vue.users);
        if(!self.vue.search_toggle)
        {
            self.vue.search_toggle = !self.vue.search_toggle;
        }
        // self.vue.search_toggle = !self.vue.search_toggle;
        self.vue.search_temp = self.vue.search_term;
        var term = self.vue.search_temp;
        var course_search = false;
        for (var i = 0; i < term.length; i++) {
            if(term.charAt(i)<='9' && term.charAt(i)>='0')
            {
                course_search=true;
                break;
            }
        }
        console.log(self.vue.search_temp);
        if(course_search==true)
        {
            var enrollments = self.vue.enrollments.filter(is_course_name(self.vue.search_temp));
            self.vue.class_search = true;
            self.vue.user_search = false;
            // console.log(enrollments);
            if(enrollments.length==0)
            {
                self.vue.search_exists = false;
            } else
            {
                self.vue.search_exists = true;
            }
        } else 
        {
            self.vue.class_search=false;
            self.vue.user_search=true;
            self.vue.searched_users=[];
            var user_found=false;
            for(var i=0;i<self.vue.users.length;i++)
            {
                var first = self.vue.users[i].first_name;
                var last = self.vue.users[i].last_name;
                var name = first + " " + last;
                if(term===name || term === first || term === last)
                {
                    user_found=true;
                    self.vue.searched_users.push(self.vue.users[i]);
                    self.vue.user_search_id = self.vue.users[i].id;
                    // console.log(self.vue.search_toggle);
                }
            }
            console.log(self.vue.searched_users);
            // console.log(self.vue.users);
            // var user = self.vue.users.filter(is_user_name(self.vue.search_temp));
            // console.log(user);
            if(!user_found)
            {
                self.vue.search_exists = false;
            } else
            {
                self.vue.search_exists = true;
            }
            // console.log(self.vue.search_exists);
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
            current_quarter: '2018 Spring Quarter',
            search_term: null,
            search_toggle: false,
            search_temp: null,
            search_exists: false,
            searched_users: [],
            user_search: false,
            class_search: false,
            users_all: []
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
