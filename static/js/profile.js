var app = function() {
    var self = {};
    Vue.config.silent = false;


    // API Calls
    self.get_auth_user = function() {
        return $.getJSON(get_auth_user_url).fail(function() {
            alert('ERROR - getJSON request (get_auth_user_url) failed');
        });
    };
    self.get_enrollments = function() {
        return $.getJSON(get_enrollments_url).fail(function() {
            alert('ERROR - getJSON request (get_enrollments_url) failed');
        });
    };
    self.add_multiple_enrollments = function(enrollments) {
        return $.post(add_multiple_enrollments_url, {enrollments:JSON.stringify(enrollments)}).fail(function() {
            alert('ERROR - post request (add_multiple_enrollments_url) failed');
        });
    };
    self.add_multiple_courses = function(courses) {
        return $.post(add_multiple_courses_url, {courses:JSON.stringify(courses)}).fail(function() {
            alert('ERROR - post request (add_multiple_courses_url) failed');
        });
    };
    self.update_multiple_enrollments = function(enrollments) {
        return $.post(update_multiple_enrollments_url, {enrollments:JSON.stringify(enrollments)}).fail(function() {
            alert('ERROR - post request (update_multiple_enrollments_url) failed');
        });
    };
    self.update_profile = function(user) {
        return $.post(update_profile_url, 
            {
                id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                bio: user.bio,
                is_public: user.is_public,
            }
        ).fail(function() {
            alert('ERROR - post request (update_profile_url) failed');
        });
    }


    // Private Helper functions
    self.init_data = function() {
        $.when(
            self.get_auth_user(),
            self.get_enrollments(),
        ).done(function(response1, response2) {
            self.vue.auth_user = response1[0].auth_user;
            self.vue.enrollments = response2[0].enrollments;
            self.vue.is_loaded = true;
        });
    };
    self.make_enrollments_courses = function(transcript_objs) {
        let enrollments = [];
        let courses = [];
        for(var i=0; i<transcript_objs.length; i++) {
            let transcript_obj = transcript_objs[i];
            let quarter = transcript_obj.quarter;
            let courses_ = transcript_obj.courses;
            for(var j=0; j<courses_.length; j++) {
                let course = courses_[j];
                let course_name = course.course_name;
                var grade = course.grade;
                if(grade==null) {
                    grade = (quarter==self.vue.current_quarter)?'IN PROGRESS':'N/A';
                };
                let course_description = course.course_description;
                enrollments.push({course_name:course_name, quarter:quarter, grade:grade});
                courses.push({course_name:course_name, course_description:course_description});
            };
        };
        return [enrollments, courses];
    };
    self.fill_databases = function(transcript_objs) {
        let results = self.make_enrollments_courses(transcript_objs);
        let enrollments = results[0];
        let courses = results[1];
        $.when(
            self.add_multiple_enrollments(enrollments), 
            self.add_multiple_courses(courses),
        ).then(function() {
            return self.get_enrollments();
        }).then(function(response) {
            self.vue.enrollments = response.enrollments;
        });
    };
    self.update_databases = function(transcript_objs) {
        let results = self.make_enrollments_courses(transcript_objs);
        let enrollments = results[0];
        let courses = results[1];
        $.when(
            self.update_multiple_enrollments(enrollments), 
            self.add_multiple_courses(courses),
        ).then(function() {
            return self.get_enrollments();
        }).then(function(response) {
            self.vue.enrollments = response.enrollments;
            self.toggle_update_transcript();
        });
    };
    self.parse_doc = function(doc) {
        var transcript_objs = [];
        var transcript_objs_i = 0;

        // set up selectors
        var temp_node = null;
        var temp_nodelist = null;
        temp_node = doc.querySelector('p.c19+table');
        let sel_all_tables = 'table.'+temp_node.className;

        // selectors: quarter
        temp_node = doc.querySelector('p.c19+table');
        temp_node = temp_node.querySelector('td');
        let sel1 = 'td.'+temp_node.className;
        temp_node = temp_node.querySelector('table');
        let sel2 = 'table.'+temp_node.className;
        temp_node = temp_node.querySelector('tr');
        let sel3 = 'tr.'+temp_node.className;
        temp_node = temp_node.querySelector('td');
        let sel4 = 'td.'+temp_node.className;
        temp_node = temp_node.querySelector('p');
        let sel5 = 'p.'+temp_node.className;

        // selectors: courses
        temp_node = doc.querySelector('p.c19+table+table');
        temp_nodelist = temp_node.querySelectorAll('table');
        temp_node = temp_nodelist.item(1);
        let sel7 = 'table.'+temp_node.className;

        // selectors: name
        temp_nodelist = temp_node.querySelectorAll(sel3);
        temp_node = temp_nodelist.item(1);
        var temp_node_0 = temp_node;
        temp_nodelist = temp_node_0.querySelectorAll('td');
        temp_node = temp_nodelist.item(0);
        let sel8 = 'td.'+temp_node.className;
        temp_node = temp_nodelist.item(2);
        let sel9 = 'td.'+temp_node.className;

        // selectors: grade
        temp_node = temp_nodelist.item(5);
        let sel10 = 'td.'+temp_node.className;
        
        let quarter_selector = sel1+' '+sel2+' '+sel3+' '+sel4+' '+sel5+' span.c11 b';
        let course_selector = sel1+' '+sel7+' '+sel3;
        let course_name_selector = sel8+' p.c6 span.c11';
        let course_description_selector = sel9+' p.c6 span.c11';

        // get all tables in transcript html
        let table_nodelist = doc.querySelectorAll(sel_all_tables);
        for(var i=0; i<table_nodelist.length; i++) {
            let table_node = table_nodelist.item(i);
            // get quarter
            let quarter_nodelist = table_node.querySelectorAll(quarter_selector);
            for(var j=0; j<quarter_nodelist.length; j++) {
                let quarter_node = quarter_nodelist.item(j);
                let quarter = quarter_node.innerText;
                transcript_objs_i = transcript_objs.push({quarter:quarter, courses:[]}) - 1;
            };
            // get courses
            let course_nodelist = table_node.querySelectorAll(course_selector);
            for(var j=0; j<course_nodelist.length; j++) {
                let course_node = course_nodelist.item(j);
                let course_obj = {};
                // get course_name
                let course_name_nodelist = course_node.querySelectorAll(course_name_selector);
                if(course_name_nodelist.length == 2) {
                    let course_name_1 = (course_name_nodelist.item(0)).textContent;
                    let course_name_2 = (course_name_nodelist.item(1)).textContent;
                    let course_name = course_name_1+course_name_2;
                    course_obj.course_name = course_name;
                };
                // get course_description
                let course_description_nodelist = course_node.querySelectorAll(course_description_selector);
                if(course_description_nodelist.length == 1) {
                    let course_description = (course_description_nodelist.item(0)).textContent;
                    course_obj.course_description = course_description;
                };
                // get course_grade
                let grade_node = course_node.querySelector(sel10);
                if(grade_node != null) {
                    var grade = null;
                    let grade_node_ = grade_node.querySelector(sel5+' span.c11');
                    if(grade_node_ != null) {
                        grade = grade_node_.textContent;    
                    };
                    if(grade != null) {
                        course_obj.grade = grade;
                    }
                };
                // add course array of courses per quarter
                if(!$.isEmptyObject(course_obj)) {
                    (transcript_objs[transcript_objs_i]).courses.push(course_obj);
                };
            };
        };
        return transcript_objs;
    };


    // search and filter predicates
    self.is_user_id = function(user_id) {
        return function(elem) { return elem.user_id == user_id; };
    };


    // List rendering functions
    self.auth_user_enrollments = function() {
        let this_ = self.vue;
        // query auth_user's enrollments
        var enrollments = this_.enrollments.filter(self.is_user_id(this_.auth_user.id));
        return enrollments;
    };


    // Other functions
    self.is_transcript_loaded = function() {
        return (self.vue.enrollments.find(self.is_user_id(self.vue.auth_user.id)) != null);
    };


    // UI functions
    self.toggle_update_profile = function() {
        self.vue.is_updating_profile = !self.vue.is_updating_profile;
    };
    self.toggle_update_transcript = function() {
        self.vue.is_updating_transcript = !self.vue.is_updating_transcript;
    };
    self.upload_transcript = function() {
        let input = document.querySelector('#upload_transcript_file_input');
        let files = input.files;
        let file = files[0];
        if(file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function(event) {
                let result_str = reader.result;
                let doc = document.createElement('html');
                doc.innerHTML = result_str;
                let transcript_objs = self.parse_doc(doc);
                self.fill_databases(transcript_objs);
            };
        } else {
            alert('failed to load file');
        };
    };
    self.update_transcript = function() {
        let input = document.querySelector('#upload_transcript_file_input');
        let files = input.files;
        let file = files[0];
        if(file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function(event) {
                let result_str = reader.result;
                let doc = document.createElement('html');
                doc.innerHTML = result_str;
                let transcript_objs = self.parse_doc(doc);
                self.update_databases(transcript_objs)
            };
        } else {
            alert('failed to load file');
        };
    };
    self.click_update_profile = function() {
        let user = {
            first_name: document.querySelector('#first_name_input').value,
            last_name: document.querySelector('#last_name_input').value,
            email: document.querySelector('#email_input').value,
            bio: (document.querySelector('#bio_input')).value,
            is_public: document.querySelector('#is_public_input').checked,
        };
        $.when(self.update_profile(user)).done(function(response) {
            self.vue.auth_user = response.auth_user;
            self.toggle_update_profile();
        });
    };

    
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_loaded: false,
            is_updating_profile: false,
            is_updating_transcript: false,
            auth_user: {},
            enrollments: [],
            current_quarter: '2018 Spring Quarter',
        },
        methods: {
            is_user_id: self.is_user_id,
            auth_user_enrollments: self.auth_user_enrollments,

            is_transcript_loaded: self.is_transcript_loaded,

            toggle_update_profile: self.toggle_update_profile,
            toggle_update_transcript: self.toggle_update_transcript,
            upload_transcript: self.upload_transcript,
            click_update_profile: self.click_update_profile,
            update_transcript: self.update_transcript,
        },
        computed: {
        },
        created() {
            self.init_data();
            $('#vue-div').show();
        }
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
