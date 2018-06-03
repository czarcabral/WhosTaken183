var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.fill_courses_db = function(enrollment_objs) {
        for(var i=0; i<enrollment_objs.length; i++) {
            let enrollment_obj = enrollment_objs[i];
            let courses = enrollment_obj.courses;
            for(var j=0; j<courses.length; j++) {
                let course = courses[j];
                let course_name = course.course_name;
                let course_description = course.course_description;
                (function(course_name, course_description) {
                    $.post(add_course_url, 
                        {course_name:course_name, course_description:course_description}, 
                        function(data) {}
                    );
                })(course_name, course_description);
            };
        };
    };
    self.fill_enrollments_db = function(enrollment_objs) {
        for(var i=0; i<enrollment_objs.length; i++) {
            let enrollment_obj = enrollment_objs[i];
            let quarter = enrollment_obj.quarter;
            let courses = enrollment_obj.courses;
            for(var j=0; j<courses.length; j++) {
                let course = courses[j];
                let course_name = course.course_name;
                let grade = course.grade;
                (function(course_name, quarter, grade) {
                    $.post(add_enrollment_url, 
                        {course_name:course_name, quarter:quarter, grade:grade}, 
                        function(data) {}
                    );
                })(course_name, quarter, grade);
            };
        };
    };
    self.fill_databases = function(enrollment_objs) {
        self.fill_courses_db(enrollment_objs);
        self.fill_enrollments_db(enrollment_objs);
    };
    self.parse_doc = function(doc) {
        var enrollment_objs = [];
        var enrollment_objs_i = 0;
        // get all tables in transcript html
        let table_nodelist = doc.querySelectorAll('table.c35');
        for(var i=0; i<table_nodelist.length; i++) {
            let table_node = table_nodelist.item(i);
            // get quarter
            let quarter_nodelist = table_node.querySelectorAll('tr.c26 td.c27 table.c30 tr.c28 td.c27 p.c29 span.c11 b');
            for(var j=0; j<quarter_nodelist.length; j++) {
                let quarter_node = quarter_nodelist.item(j);
                let quarter = quarter_node.textContent;
                enrollment_objs_i = enrollment_objs.push({quarter:quarter, courses:[]}) - 1;
            };
            // get courses
            let course_nodelist = table_node.querySelectorAll('td.c27 table.c34 tr.c28');
            for(var j=0; j<course_nodelist.length; j++) {
                let course_node = course_nodelist.item(j);
                let course_obj = {};
                // get course_name
                let course_name_nodelist = course_node.querySelectorAll('td.c44 p.c6 span.c11');
                if(course_name_nodelist.length == 2) {
                    let course_name_1 = (course_name_nodelist.item(0)).textContent;
                    let course_name_2 = (course_name_nodelist.item(1)).textContent;
                    let course_name = course_name_1+course_name_2;
                    course_obj.course_name = course_name;
                };
                // get course_description
                let course_description_nodelist = course_node.querySelectorAll('td.c40 p.c6 span.c11');
                if(course_description_nodelist.length == 1) {
                    let course_description = (course_description_nodelist.item(0)).textContent;
                    course_obj.course_description = course_description;
                };
                // get course_grade
                let grade_nodelist = course_node.querySelectorAll('td.c43 p.c29 span.c11');
                if(grade_nodelist.length == 1) {
                    let grade = (grade_nodelist.item(0)).textContent;
                    course_obj.grade = grade;
                };
                // add course array of courses per quarter
                if(!$.isEmptyObject(course_obj)) {
                    (enrollment_objs[enrollment_objs_i]).courses.push(course_obj);
                };
            };
        };
        self.fill_databases(enrollment_objs);
    };
    self.upload_file = function() {
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
                self.parse_doc(doc);
            };
        } else {
            alert('failed to load file');
        };
    },
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
        },
        methods: {
            upload_file: self.upload_file,
        },
        computed: {
        },
        created() {
            $('#vue-div').show();
        },
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
