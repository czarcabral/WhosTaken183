var app = function() {
    var self = {};
    Vue.config.silent = false;


    // API Calls
    self.get_auth_user = function() {
        return $.getJSON(get_auth_user_url).fail(function() {
            alert('ERROR - getJSON request (get_auth_user_url) failed');
        });
    };
    self.add_course = function(name, description) {
        return $.post(add_course_url, {course_name:name, course_description:description}).fail(function() {
            alert('ERROR - post request (add_course_url) failed');
        });
    };
    self.add_enrollment = function(course_name, quarter, grade) {
        return $.post(add_enrollment_url, {course_name:course_name, quarter:quarter, grade:grade}).fail(function() {
            alert('ERROR - post request (add_enrollment_url) failed');
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
        $.when(self.get_auth_user()).done(function(response1) {
            self.vue.auth_user = response1.auth_user;
        });
    };
    self.fill_courses_db = function(transcript_objs) {
        for(var i=0; i<transcript_objs.length; i++) {
            let transcript_obj = transcript_objs[i];
            let courses = transcript_obj.courses;
            for(var j=0; j<courses.length; j++) {
                let course = courses[j];
                let course_name = course.course_name;
                let course_description = course.course_description;
                (function(course_name, course_description) {
                    self.add_course(course_name, course_description);
                })(course_name, course_description);
            };
        };
    };
    self.fill_enrollments_db = function(transcript_objs) {
        for(var i=0; i<transcript_objs.length; i++) {
            let transcript_obj = transcript_objs[i];
            let quarter = transcript_obj.quarter;
            let courses = transcript_obj.courses;
            for(var j=0; j<courses.length; j++) {
                let course = courses[j];
                let course_name = course.course_name;
                let grade = course.grade;
                (function(course_name, quarter, grade) {
                    self.add_enrollment(course_name, quarter, grade);
                })(course_name, quarter, grade);
            };
        };
    };
    self.fill_databases = function(transcript_objs) {
        self.fill_courses_db(transcript_objs);
        self.fill_enrollments_db(transcript_objs);
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


    // UI functions
    self.try_upload_file = function() {
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
    self.try_update_profile = function() {
        let user = {
            first_name: document.querySelector('#first_name_input').value,
            last_name: document.querySelector('#last_name_input').value,
            email: document.querySelector('#email_input').value,
            bio: (document.querySelector('#bio_input')).value,
            is_public: document.querySelector('#is_public_input').checked,
        };
        self.update_profile(user);
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            auth_user: {},
        },
        methods: {
            upload_file: self.try_upload_file,
            update_profile: self.try_update_profile,
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
